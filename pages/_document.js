import Document, {Head, Main, NextScript} from 'next/document';


export default class MyDocument extends Document {
  render() {
    return (
      <html>
      <Head>
        {/*<title>我要学</title>*/}
        <meta charSet='utf-8'/>
        {/*<!--隐藏状态栏/设置状态栏颜色-->*/}
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>

        {/*<!--忽略自动识别数字为电话号码：-->*/}
        <meta content="telephone=no" name="format-detection"/>

        {/*<!--忽略自动识别邮箱账号：-->*/}
        <meta content="email=no" name="format-detection"/>

        <meta name='viewport' content='width=device-width'/>
        <meta name="hotcss" content="max-width=0, design-width=414"/>
        <script src="/static/hotcss/hotcss414.js"/>
      </Head>
      <body>
      <Main/>
      <NextScript/>

      </body>
      </html>
    );
  }
}
