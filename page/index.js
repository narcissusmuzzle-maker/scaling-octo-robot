import { BasePage } from '@zeppos/zml/base-page'
import { createWidget, widget, align, text_style, prop } from '@zos/ui'
import { px } from '@zos/utils'

let statusWidget = null

function setStatus(text) {
  if (statusWidget) statusWidget.setProperty(prop.TEXT, text)
}

Page(
  BasePage({
    build() {
      createWidget(widget.TEXT, {
        x: px(0),
        y: px(40),
        w: px(432),
        h: px(60),
        color: 0xffffff,
        text_size: px(40),
        align_h: align.CENTER_H,
        align_v: align.CENTER_V,
        text: 'U613',
      })

      statusWidget = createWidget(widget.TEXT, {
        x: px(24),
        y: px(110),
        w: px(384),
        h: px(130),
        color: 0xcccccc,
        text_size: px(30),
        align_h: align.CENTER_H,
        align_v: align.CENTER_V,
        text_style: text_style.WRAP,
        text: 'Нажмите Связь',
      })

      createWidget(widget.BUTTON, {
        x: px(36),
        y: px(260),
        w: px(360),
        h: px(90),
        radius: px(24),
        normal_color: 0x1e88e5,
        press_color: 0x0d47a1,
        text: 'Связь',
        text_size: px(36),
        color: 0xffffff,
        click_func: () => {
          this.send({ t: 'ping', ts: Date.now() })
        },
      })

      createWidget(widget.BUTTON, {
        x: px(36),
        y: px(370),
        w: px(360),
        h: px(90),
        radius: px(24),
        normal_color: 0x43a047,
        press_color: 0x1b5e20,
        text: '+1 час (кровь)',
        text_size: px(32),
        color: 0xffffff,
        click_func: () => {
          const id = 'w' + Date.now() + '-' + Math.floor(Math.random() * 1000000)
          this.send({ t: 'done', id: id, e: '\u{1FA78}', ts: Date.now() })
        },
      })
    },

    send(payload) {
      setStatus('Отправка...')
      return this.request({ method: 'u613.send', params: payload })
        .then((result) => {
          if (!result || !result.ok) {
            setStatus('Телефон не ответил: ' + (result && result.error ? result.error : 'нет данных'))
            return
          }
          const reply = result.reply || {}
          if (reply.t === 'pong') setStatus('Связь есть: OK\nТелефон ответил')
          else if (reply.t === 'ack') setStatus('Записано: OK')
          else setStatus('Ответ: ' + JSON.stringify(reply))
        })
        .catch((err) => {
          setStatus('Нет связи с Zepp: ' + String(err))
        })
    },
  })
)
