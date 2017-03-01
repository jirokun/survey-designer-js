/* eslint-env jest */
import PageManager from '../../lib/runtime/PageManager';

describe('PageManager', () => {
  describe('firePageLoad', () => {
    it('pageLoadを発火する', () => {
      const pm = new PageManager();
      let isCalled = false;
      pm.on('pageLoad', () => { isCalled = true; });
      pm.firePageLoad();
      expect(isCalled).toBe(true);
    });
  });

  describe('firePageUnload', () => {
    it('pageUnloadを発火する', () => {
      const pm = new PageManager();
      let isCalled = false;
      pm.on('pageUnload', () => { isCalled = true; });
      pm.firePageUnload();
      expect(isCalled).toBe(true);
    });
  });

  describe('fireValidate', () => {
    it('validateを発火する', () => {
      const pm = new PageManager();
      let isCalled = false;
      pm.on('validate', (resolve) => {
        isCalled = true;
        resolve();
      });
      return pm.fireValidate().then(() => {
        expect(isCalled).toBe(true);
      });
    });

    it('validate結果を取得できる', () => {
      const pm = new PageManager();
      pm.on('validate', resolve => resolve('失敗しました'));
      return pm.fireValidate().then((result) => {
        expect(result.length).toBe(1);
        expect(result[0]).toBe('失敗しました');
      });
    });

    it('複数のvalidate結果を取得できる', () => {
      const pm = new PageManager();
      pm.on('validate', resolve => resolve('失敗しました1'));
      pm.on('validate', resolve => resolve('失敗しました2'));
      return pm.fireValidate().then((result) => {
        expect(result.length).toBe(2);
        expect(result[0]).toBe('失敗しました1');
        expect(result[1]).toBe('失敗しました2');
      });
    });

    it('validate中に例外が発生したときは例外が取得できる', () => {
      const pm = new PageManager();
      const error = new Error('HOGE');
      pm.on('validate', () => { throw error; });
      return pm.fireValidate().then(() => {
        expect(true).toBe(false); // force error
      }).catch((reason) => {
        expect(reason.message).toBe(error.message);
      });
    });

    it('指定時間内に帰ってこない場合エラーとなる', () => {
      const pm = new PageManager();
      pm.on('validate', () => {});
      return pm.fireValidate().then(() => {
        expect(true).toBe(false); // force error
      }).catch((reason) => {
        expect(reason).toBe('バリデーション処理がタイムアウトしました');
      });
    });
  });
});
