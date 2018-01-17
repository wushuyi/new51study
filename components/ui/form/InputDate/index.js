import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import DatePicker from 'antd-mobile/lib/date-picker'
import List from 'antd-mobile/lib/list'
import dateParse from 'date-fns/parse'
import WrapFragment from 'components/ui/form/utils/WrapComponent'

const now = dateParse('2018-01-01 00:00')

export default class InputDate extends React.PureComponent {

  static propTypes = {
    field: PropTypes.any.isRequired,
    form: PropTypes.any.isRequired,
    forma: PropTypes.string,
    initDate: PropTypes.any,
    labelName: PropTypes.string,
    mode: PropTypes.string,
    placeholder: PropTypes.any
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
    const extra = placeholder || `请选择${labelName || field.name}`
    return (
      <Fragment>
        <DatePicker
          {...props}
          extra={extra}
          value={this.state.date}
          onChange={date => {
            this.setState({date})
            form.setFieldValue(field.name, date)
          }}
          WrapComponent={WrapFragment}
        >
          <List.Item labelNumber={7}>{labelName}</List.Item>
        </DatePicker>
        {/*language=CSS*/}
        {/*<style jsx>{Style}</style>*/}
      </Fragment>
    )
  }
}