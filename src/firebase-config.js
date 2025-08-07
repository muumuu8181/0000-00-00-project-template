
// ============================================================
// 🔥 Firebase自動設定 - 変更禁止・回避不可能 
// ============================================================
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue, set } from 'firebase/database';
import { getAuth, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
  "apiKey": "demo-api-key-auto-generated",
  "authDomain": "auto-generated-project.firebaseapp.com",
  "databaseURL": "https://auto-generated-project-default-rtdb.firebaseio.com",
  "projectId": "auto-generated-project",
  "storageBucket": "auto-generated-project.appspot.com",
  "messagingSenderId": "123456789012",
  "appId": "1:123456789012:web:auto-generated-app-id"
};

// Firebase初期化 (必須・スキップ不可)
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// 匿名認証 (自動実行・回避不可能)
signInAnonymously(auth).then(() => {
    console.log('🔥 Firebase接続成功 - LocalStorage逃避は不可能');
}).catch((error) => {
    console.error('Firebase接続必須 - LocalStorageへの逃避は禁止', error);
});

// データベース操作関数 (Firebase強制)
export const saveData = (collection, data) => {
    const dbRef = ref(database, collection);
    return push(dbRef, {
        ...data,
        timestamp: Date.now(),
        source: 'firebase-required' // LocalStorage使用の検出用
    });
};

export const loadData = (collection, callback) => {
    const dbRef = ref(database, collection);
    return onValue(dbRef, callback);
};

// ============================================================
// 🚨 重要: この設定を変更またはLocalStorageに変更すると
//     テンプレートの検証で自動的に検出・報告されます
// ============================================================
