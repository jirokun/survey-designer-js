/* eslint-env browser */
import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import classNames from 'classnames';
import $ from 'jquery';
import '../../css/imageManager.scss';

/**
 * TinyMCEからも画像管理からも使うので、プレーンなReactコンポーネントとして実装する。Reduxは使わない
 */
export default class ImageManager extends Component {
  constructor(props) {
    super(props);

    this.bindedHandleInsertFormSubmitMessage = this.handleInsertFormSubmitMessage.bind(this);

    this.state = {
      image: null,
      size: 'normal',
      clickAction: 'none',
      clickRequired: false,
    };
  }

  componentDidMount() {
    window.addEventListener('message', this.bindedHandleInsertFormSubmitMessage, false);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.bindedHandleFormSubmitMessage);
  }

  getFormData($form) {
    const ar = $form.serializeArray();
    const params = {};
    $.map(ar, (n) => { params[n.name] = n.value; });
    return params;
  }

  handleChangeForm(e) {
    const target = e.target;
    const name = target.name;
    if (target.type === 'checkbox') {
      this.setState({ [name]: target.checked });
    } else {
      const value = target.value;
      const state = {};
      if (name === 'clickAction' && value === 'none') {
        state.clickRequired = false;
      }
      state[name] = value;
      this.setState(state);
    }
  }

  handleUploadFiles(e) {
    const { uploadImagesFunc } = this.props;
    const formEl = e.target;
    e.preventDefault();
    const formData = new FormData(this.uploadFormEl);
    uploadImagesFunc(formData);
    formEl.reset();
  }

  handleInsertFormSubmitMessage(e) {
    if (e.origin !== location.origin) {
      alert('オリジンが一致しません');
      return;
    }
    if (e.data.type !== 'submitInsertForm') return;

    if (this.state.image === null) {
      alert('挿入する画像が選択されていません');
      return;
    }
    const params = this.state;
    this.props.insertImageFunc({ params });
  }

  handleChangeUploadFiles(e) {
    const files = e.target.files;
    for (let i = 0, len = files.length; i < len; i++) {
      const file = files[i];
      if (file.size > 1024 * 1024 * 3) {
        e.target.value = null;
        alert(`${file.name}のファイルサイズが3MBを超えています`);
        return;
      }
    }
  }

  handleClickDelete(image) {
    this.props.deleteImageFunc(image);
  }

  handleClickImage(image) {
    this.setState({ image });
  }

  submitInsertForm() {
    const param = this.getFormData($(this.insertFormEl));
    window.parent.postMessage({ type: 'insertImage', value: JSON.stringify(param) }, '*');
  }

  render() {
    const imageList = this.props.imageList;
    const image = this.state.image;
    return (
      <div>
        <form ref={(el) => { this.uploadFormEl = el; }} className="upload-form" onSubmit={e => this.handleUploadFiles(e)}>
          <fieldset className="container-fluid">
            <legend>画像のアップロード</legend>
            <div className="row">
              <div className="col-sm-12">
                画像は複数まとめてアップロードできます。<br />
                ファイルサイズは3MBまでです。
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12">
                <input name="imageFileList" type="file" onChange={e => this.handleChangeUploadFiles(e)} accept="image/*" multiple />
                <Button type="submit">アップロード</Button>
              </div>
            </div>
          </fieldset>
        </form>

        <form ref={(el) => { this.insertFormEl = el; }} onChange={e => this.handleChangeForm(e)}>
          <fieldset className="container-fluid">
            <legend>画像の挿入</legend>
            <div className="row">
              <div className="col-sm-4">
                <div className="form-group">
                  <label>画像サイズ</label>
                  <div className="radio"><label><input type="radio" name="size" value="normal" checked={this.state.size === 'normal'} /> 通常サイズ(横幅最大600px)</label></div>
                  <div className="radio"><label><input type="radio" name="size" value="thumb" checked={this.state.size === 'thumb'} /> サムネイル(横幅最大150px)</label></div>
                </div>
              </div>

              <div className="col-sm-4">
                <div className="form-group">
                  <label>クリック時の動作</label>
                  <div className="radio"><label><input type="radio" name="clickAction" value="none" checked={this.state.clickAction === 'none'} /> 何もしない </label></div>
                  <div className="radio"><label><input type="radio" name="clickAction" value="original" checked={this.state.clickAction === 'original'} /> オリジナル画像を表示</label></div>
                  <div className="radio"><label><input type="radio" name="clickAction" value="normal" checked={this.state.clickAction === 'normal'} /> 通常サイズを表示(横幅最大600px)</label></div>
                </div>
              </div>

              <div className="col-sm-4">
                <div className="form-group">
                  <label>その他</label>
                  <div className="checkbox">
                    <label>
                      <input type="checkbox" name="clickRequired" checked={this.state.clickRequired} disabled={this.state.clickAction === 'none'} /> クリック必須
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-12">
                <div className="form-group">
                  <label>画像のタイトル</label>
                  <input type="text" className="form-control" />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-12">
                <div className="form-group">
                  <label>挿入する画像</label>
                  <div className="image-container">
                    {
                      imageList.map((img) => {
                        const isSelected = image && image.id === img.id;
                        return (
                          <div key={img.id} className="image-block">
                            <a
                              className={classNames('image-link', { selected: isSelected })}
                              href="javascript:void(0)"
                              onClick={() => this.handleClickImage(img)}
                            >
                              <img src={img.thumbnailUrl} alt={img.title} />
                            </a>
                            <Button bsStyle="danger" bsSize="xs" className="pull-left" onClick={() => this.handleClickDelete(img)}>削除</Button>
                          </div>
                        );
                      })
                    }
                  </div>
                </div>
              </div>
            </div>
          </fieldset>
        </form>
      </div>
    );
  }
}
