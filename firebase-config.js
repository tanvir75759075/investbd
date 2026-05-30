// ================================================================
// InvestBD - Firebase Configuration
// ================================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, addDoc, getDocs, query, where, orderBy } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCu-UBa4vCRLByPkQqlb5JjVvuHqMFPYxM",
  authDomain: "investbd-783df.firebaseapp.com",
  projectId: "investbd-783df",
  storageBucket: "investbd-783df.firebasestorage.app",
  messagingSenderId: "1043148979663",
  appId: "1:1043148979663:web:20465ee152597ce101e6ba"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ================================================================
// AUTH FUNCTIONS — Login & Register
// ================================================================

// Register নতুন user
async function registerUser(name, phone, email, password, referralCode) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // User data Firestore এ save করো
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: name,
      phone: phone,
      email: email,
      balance: 0,
      totalEarned: 0,
      totalDeposit: 0,
      totalWithdraw: 0,
      referralCode: generateReferralCode(name),
      referredBy: referralCode || null,
      joinDate: new Date().toISOString(),
      status: "active"
    });

    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Login
async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Logout
async function logoutUser() {
  await signOut(auth);
  window.location.href = "index.html";
}

// Auth state check
function checkAuth(callback) {
  onAuthStateChanged(auth, callback);
}

// ================================================================
// USER FUNCTIONS
// ================================================================

// User data পড়ো
async function getUserData(uid) {
  try {
    const docSnap = await getDoc(doc(db, "users", uid));
    if (docSnap.exists()) return docSnap.data();
    return null;
  } catch (error) {
    return null;
  }
}

// User balance update
async function updateBalance(uid, amount) {
  try {
    const userData = await getUserData(uid);
    if (!userData) return false;
    await updateDoc(doc(db, "users", uid), {
      balance: userData.balance + amount,
      totalEarned: userData.totalEarned + (amount > 0 ? amount : 0)
    });
    return true;
  } catch (error) {
    return false;
  }
}

// ================================================================
// DEPOSIT FUNCTIONS
// ================================================================

// Deposit request পাঠাও
async function submitDeposit(uid, method, senderNumber, trxId, amount) {
  try {
    await addDoc(collection(db, "deposits"), {
      uid: uid,
      method: method,
      senderNumber: senderNumber,
      trxId: trxId,
      amount: amount,
      status: "pending",
      createdAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ================================================================
// WITHDRAW FUNCTIONS
// ================================================================

// Withdraw request পাঠাও
async function submitWithdraw(uid, method, number, name, amount) {
  try {
    const userData = await getUserData(uid);
    if (!userData || userData.balance < amount) {
      return { success: false, error: "অপর্যাপ্ত ব্যালেন্স" };
    }
    await addDoc(collection(db, "withdraws"), {
      uid: uid,
      method: method,
      number: number,
      accountName: name,
      amount: amount,
      charge: Math.round(amount * 0.03),
      netAmount: amount - Math.round(amount * 0.03),
      status: "pending",
      createdAt: new Date().toISOString()
    });
    // Balance থেকে কেটে নাও
    await updateDoc(doc(db, "users", uid), {
      balance: userData.balance - amount,
      totalWithdraw: userData.totalWithdraw + amount
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ================================================================
// PLAN FUNCTIONS
// ================================================================

// Plan কিনো
async function buyPlan(uid, planName, invest, dailyIncome, days) {
  try {
    const userData = await getUserData(uid);
    if (!userData || userData.balance < invest) {
      return { success: false, error: "অপর্যাপ্ত ব্যালেন্স" };
    }
    await addDoc(collection(db, "userPlans"), {
      uid: uid,
      planName: planName,
      invest: invest,
      dailyIncome: dailyIncome,
      days: days,
      daysLeft: days,
      totalEarned: 0,
      status: "active",
      startDate: new Date().toISOString()
    });
    await updateDoc(doc(db, "users", uid), {
      balance: userData.balance - invest,
      totalDeposit: userData.totalDeposit + invest
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// User এর active plans পড়ো
async function getUserPlans(uid) {
  try {
    const q = query(collection(db, "userPlans"), where("uid", "==", uid), where("status", "==", "active"));
    const querySnapshot = await getDocs(q);
    const plans = [];
    querySnapshot.forEach(doc => plans.push({ id: doc.id, ...doc.data() }));
    return plans;
  } catch (error) {
    return [];
  }
}

// ================================================================
// HELPER FUNCTIONS
// ================================================================

// Referral code তৈরি
function generateReferralCode(name) {
  const cleanName = name.replace(/\s+/g, '').toUpperCase().substring(0, 6);
  const num = Math.floor(1000 + Math.random() * 9000);
  return cleanName + num;
}

// Error message বাংলায়
function getErrorMessage(errorCode) {
  const errors = {
    "auth/email-already-in-use": "এই ইমেইল দিয়ে আগেই account আছে।",
    "auth/weak-password": "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।",
    "auth/user-not-found": "এই ইমেইলে কোনো account নেই।",
    "auth/wrong-password": "ভুল পাসওয়ার্ড।",
    "auth/invalid-email": "ইমেইল সঠিক নয়।",
    "auth/too-many-requests": "অনেকবার চেষ্টা করা হয়েছে। একটু পরে আবার চেষ্টা করুন।"
  };
  return errors[errorCode] || "কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।";
}

// ================================================================
// EXPORT
// ================================================================
export {
  auth, db,
  registerUser, loginUser, logoutUser, checkAuth,
  getUserData, updateBalance,
  submitDeposit, submitWithdraw,
  buyPlan, getUserPlans,
  getErrorMessage
};