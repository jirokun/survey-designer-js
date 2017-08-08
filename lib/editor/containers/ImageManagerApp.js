/* eslint-env browser */
import React, { Component } from 'react';
import $ from 'jquery';
import { List } from 'immutable';
import ImageManager from '../components/editors/ImageManager';
import '../css/bootstrap.less';

/**
 * ImageManagerのアプリ
 * 
 * TinyMCEからも画像管理からも使うので、プレーンなReactコンポーネントとして実装する。Reduxは使わない
 */
export default class ImageManagerApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageList: List(), // 画像のリスト
    };
  }

  componentDidMount() {
    const { options } = this.props;
    $.ajax({
      url: options.imageListUrl,
      dataType: 'json',
    }).done((json) => {
      this.setState({ imageList: List(json) });
    }).fail((error) => {
      console.log(error);
      alert('画像の一覧取得に失敗しました');
    });
  }

  uploadImages(formData) {
    const { options } = this.props;
    $.ajax({
      url: options.uploadImageUrl,
      method: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      dataType: 'json',
    }).done((res) => {
      res.imageList.forEach(image => this.setState({ imageList: this.state.imageList.unshift(image) }));
    }).fail(() => {
      alert('ファイルのアップロードに失敗しました');
    });
  }

  deleteImage(image) {
    const { options } = this.props;
    const imageId = image.id;
    $.ajax({
      url: options.deleteImageUrl,
      method: 'POST',
      data: { imageId },
      dataType: 'json',
    }).done(() => {
      this.setState({ imageList: this.state.imageList.filter(img => img.id !== image.id) });
    }).fail(() => {
      alert('ファイルの削除に失敗しました');
    });
  }

  handleInsertImage(params) {
    window.parent.postMessage({ type: 'insertImage', value: JSON.stringify(params) }, '*');
  }

  render() {
    return (
      <div className="image-manager" style={{ paddingLeft: '8px' }}>
        <ImageManager
          uploadImagesFunc={formData => this.uploadImages(formData)}
          insertImageFunc={params => this.handleInsertImage(params)}
          deleteImageFunc={image => this.deleteImage(image)}
          imageList={this.state.imageList}
        />
      </div>
    );
  }
}
