import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import classnames from 'classnames'
import DatePicker from 'antd-mobile/lib/date-picker'
import List from 'antd-mobile/lib/list'
import dateParse from 'date-fns/parse'
import WrapFragment from 'components/ui/form/utils/WrapComponent'
import InputItemComponent from 'components/ui/form/utils/InputItemComponent'
import DateParse from 'date-fns/parse'

function resolveScopedStyles (scope) {
  return {
    className: scope.props.className,
    styles: scope.props.children,
  }
}

const scoped = resolveScopedStyles((
  <scope>
    <style jsx>{Style}</style>
  </scope>
))

export default class InputDate extends React.Component {

  static propTypes = {
    field: PropTypes.any.isRequired,
    form: PropTypes.any.isRequired,
    forma: PropTypes.string,
    initDate: PropTypes.any,
    labelName: PropTypes.string,
    mode: PropTypes.string,
    placeholder: PropTypes.any,
  }

  static defaultProps = {
    mode: 'time',
    forma: 'HH:mm',
    labelName: '请选择时间',
    placeholder: null,
    initDate: null,
  }

  constructor (props, context) {
    super(props, context)
    const {labelName, placeholder, field} = props
    this.state = {
      date: null,
    }
  }

  componentWillReceiveProps (nextProps) {
    const {field} = this.props
    const {field: nextField} = nextProps
    if (field.value !== nextField.value) {
      this.setState({
        date: DateParse(nextField.value),
      })
    }
  }

  componentDidMount () {
    const {initDate} = this.props
    let date
    if (initDate && initDate instanceof Date) {
      date = initDate
    } else {
      date = new Date()
    }
    // this.setState({
    //   date: date,
    // })
  }

  render () {
    const {field, form, labelName, placeholder, initDate, ...props} = this.props
    const {date} = this.state
    const cls = classnames(scoped.className, {
      'placeholder': !date,
    })
    const extra = placeholder || `请选择${labelName || field.name}`
    let errProps = {}
    if (form.errors && form.touched[field.name] && form.errors[field.name]) {
      errProps.error = true
      errProps.onErrorClick = () => {
        alert(form.errors[field.name])
      }
    }
    return (
      <Fragment>
        <DatePicker
          {...props}
          className={cls}
          extra={extra}
          value={date}
          onChange={date => {
            form.setFieldValue(field.name, date)
          }}
          WrapComponent={WrapFragment}
        >
          <List.Item className={cls}>{labelName}</List.Item>
        </DatePicker>
        {scoped.styles}
        {/*language=CSS*/}
        {/*<style jsx>{Style}</style>*/}
      </Fragment>
    )
  }
}