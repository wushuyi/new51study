import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import loadImage from 'blueimp-load-image'

import { isBrowser } from 'utils/runEnv'

if (isBrowser) {
  const toBlob = require('blueimp-canvas-to-blob')
}

export default class InputFile extends React.PureComponent {

  onChange = (evt) => {
    var file = evt.target.files[0]
    console.log(file)
    loadImage(
      file,
      function (img) {
        const {width: imgW, height: imgH} = img
        var sourceSize = imgW * imgH
        var scale = Math.sqrt(1920 * 1080 / sourceSize)
        loadImage(
          file,
          function (canvas) {
            canvas.toBlob(function (blob) {
                console.log(blob)
                var newFile = new File([blob], file.name,
                  {type: blob.type, lastModified: file.lastModified})
                console.log(newFile)
                var url = URL.createObjectURL(newFile)
                var img2 = new Image()
                img2.src = url
                document.body.appendChild(canvas)
              },
              'image/jpeg')
          },
          {
            crossOrigin: true,
            canvas: true,
            orientation: true,
            maxWidth: Math.round(imgW * scale),
            maxHeight: Math.round(imgH * scale),
          },
        )
      },
      {
        crossOrigin: true,
        canvas: false,
      },
    )
  }

  render () {
    return (
      <Fragment>
        <input type="file" onChange={this.onChange}/>
        {/*language=CSS*/}
        {/*<style jsx>{Style}</style>*/}
      </Fragment>
    )
  }
}