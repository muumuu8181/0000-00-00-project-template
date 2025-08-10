/**
 * @file Authentication service - Firebase Auth wrapper
 * @description Thin wrapper around Firebase Auth for abstraction
 * @note P2 implementation - wraps existing global firebase
 */

/**
 * Get Firebase Auth instance
 * @private
 * @returns {firebase.auth.Auth} Firebase Auth instance
 */
function getAuth() {
  if (typeof firebase === 'undefined' || !firebase.auth) {
    throw new Error('Firebase Auth not initialized. Ensure Firebase is loaded in index.html');
  }
  return firebase.auth();
}

/**
 * Google認証でサインイン
 * @returns {Promise<firebase.auth.UserCredential>} 認証結果
 */
export async function signInWithGoogle() {
  const auth = getAuth();
  const provider = new firebase.auth.GoogleAuthProvider();
  
  // モバイルデバイス検出
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    // モバイルではリダイレクト方式を使用
    return auth.signInWithRedirect(provider);
  } else {
    // デスクトップではポップアップ方式を使用
    return auth.signInWithPopup(provider);
  }
}

/**
 * ユーザーをサインアウト
 * @returns {Promise<void>}
 */
export async function signOut() {
  const auth = getAuth();
  return auth.signOut();
}

/**
 * 認証状態の変更を監視
 * @param {function} handler - (user: firebase.User|null) => void
 * @returns {function} unsubscribe function
 */
export function onAuthStateChanged(handler) {
  const auth = getAuth();
  return auth.onAuthStateChanged(handler);
}

/**
 * 現在のユーザーを取得
 * @returns {firebase.User|null} 現在のユーザー
 */
export function getCurrentUser() {
  const auth = getAuth();
  return auth.currentUser;
}

/**
 * リダイレクト結果を取得（モバイル向け）
 * @returns {Promise<firebase.auth.UserCredential|null>} リダイレクト結果
 */
export async function getRedirectResult() {
  const auth = getAuth();
  return auth.getRedirectResult();
}