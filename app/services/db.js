/**
 * @file Database service - Firebase Realtime Database wrapper
 * @description Thin wrapper around Firebase Database for abstraction
 * @note P2 implementation - wraps existing global firebase
 */

/**
 * Get Firebase Database instance
 * @private
 * @returns {firebase.database.Database} Firebase Database instance
 */
function getDatabase() {
  if (typeof firebase === 'undefined' || !firebase.database) {
    throw new Error('Firebase Database not initialized. Ensure Firebase is loaded in index.html');
  }
  return firebase.database();
}

/**
 * ユーザーの記録データを保存
 * @param {string} userId - ユーザーID
 * @param {Object} recordData - 記録データ
 * @returns {Promise<string>} 保存されたレコードID
 */
export async function pushUserRecord(userId, recordData) {
  if (!userId) {
    throw new Error('userId is required');
  }
  
  const database = getDatabase();
  const recordsRef = database.ref(`users/${userId}/records`);
  
  // タイムスタンプを追加
  const dataWithTimestamp = {
    ...recordData,
    timestamp: firebase.database.ServerValue.TIMESTAMP,
    createdAt: new Date().toISOString()
  };
  
  const newRecordRef = await recordsRef.push(dataWithTimestamp);
  return newRecordRef.key;
}

/**
 * ユーザーの記録データを監視
 * @param {string} userId - ユーザーID  
 * @param {function} callback - データ変更時のコールバック (snapshot) => void
 * @returns {function} unsubscribe function
 */
export function listenUserRecords(userId, callback) {
  if (!userId) {
    throw new Error('userId is required');
  }
  
  const database = getDatabase();
  const recordsRef = database.ref(`users/${userId}/records`);
  
  // リスナーを設定
  const listener = recordsRef.on('value', (snapshot) => {
    const records = [];
    snapshot.forEach((childSnapshot) => {
      records.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    callback(records);
  });
  
  // unsubscribe関数を返す
  return () => {
    recordsRef.off('value', listener);
  };
}

/**
 * ユーザーの記録データを削除
 * @param {string} userId - ユーザーID
 * @param {string} recordId - レコードID
 * @returns {Promise<void>}
 */
export async function deleteUserRecord(userId, recordId) {
  if (!userId || !recordId) {
    throw new Error('userId and recordId are required');
  }
  
  const database = getDatabase();
  const recordRef = database.ref(`users/${userId}/records/${recordId}`);
  return recordRef.remove();
}

/**
 * ユーザーの記録データを一度だけ取得
 * @param {string} userId - ユーザーID
 * @returns {Promise<Object[]>} 記録データの配列
 */
export async function getUserRecords(userId) {
  if (!userId) {
    throw new Error('userId is required');
  }
  
  const database = getDatabase();
  const recordsRef = database.ref(`users/${userId}/records`);
  
  const snapshot = await recordsRef.once('value');
  const records = [];
  
  snapshot.forEach((childSnapshot) => {
    records.push({
      id: childSnapshot.key,
      ...childSnapshot.val()
    });
  });
  
  return records;
}

/**
 * ユーザーの記録データを更新
 * @param {string} userId - ユーザーID
 * @param {string} recordId - レコードID
 * @param {Object} updateData - 更新データ
 * @returns {Promise<void>}
 */
export async function updateUserRecord(userId, recordId, updateData) {
  if (!userId || !recordId) {
    throw new Error('userId and recordId are required');
  }
  
  const database = getDatabase();
  const recordRef = database.ref(`users/${userId}/records/${recordId}`);
  
  // 更新日時を追加
  const dataWithTimestamp = {
    ...updateData,
    updatedAt: new Date().toISOString()
  };
  
  return recordRef.update(dataWithTimestamp);
}