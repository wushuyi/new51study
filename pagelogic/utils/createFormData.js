import get from 'lodash/get'
import includes from 'lodash/includes'
import map from 'lodash/map'
import a from 'lodash/assign'

export default function createFormData (labels, defData, {
  prefix = '', needRequired = true, disabled = false
}) {
  let list = []
  for (let index in labels) {
    let item = labels[index]
    // isRequired 同时需要满足 ifNeedParentInfo
    item.isRequired = needRequired && item.isRequired
    let conf
    switch (parseInt(item.type)) {
      case 0:
        conf = {
          name: prefix + item.name,
          isRequired: item.isRequired,
          component: 'InputText',
          itemProps: {
            labelName: item.name || '',
            placeholder: item.desc || '',
            defaultval: (defData && defData[item.name]) || '',
            disabled: disabled
          },
        }
        break
      case 1: {
        let sourceDataSplit = item.text.split(',')
        let defaultval
        if (get(defData, item.name)) {
          defaultval = sourceDataSplit.indexOf(defData[item.name])
        }
        let sourceData = map(sourceDataSplit, (o, i) => {
          return {
            value: i,
            label: o,
          }
        })
        conf = {
          name: prefix + item.name,
          isRequired: item.isRequired,
          component: 'InputRadio',
          itemProps: {
            labelName: item.name || '',
            placeholder: item.desc || '',
            sourceData,
            defaultval,
            disabled: disabled
          },
        }
      }
        break
      case 2: {
        let sourceDataSplit = item.text.split(',')
        let defaultval
        if (get(defData, item.name)) {
          defaultval = map(sourceDataSplit, (o, i) => {
            return includes(defData[item.name], o)
          })
        }
        let sourceData = map(sourceDataSplit, (o, i) => {
          return {
            value: i,
            label: o,
          }
        })

        conf = {
          name: prefix + item.name,
          isRequired: item.isRequired,
          component: 'InputCheckbox',
          itemProps: {
            labelName: item.name || '',
            placeholder: item.desc || '',
            sourceData,
            defaultval,
            disabled: disabled
          },
        }
      }
        break
      case 3:
        conf = {
          name: prefix + item.name,
          isRequired: item.isRequired,
          component: 'InputImage',
          itemProps: {
            labelName: item.name || '',
            placeholder: item.desc || '',
            defaultval: (defData && defData[item.name]) || '',
            disabled: disabled
          },
        }
        break
      default:
        break
    }
    list.push(conf)
  }
  return list
}