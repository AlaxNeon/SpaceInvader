
const MOVE_SPEED = 500
const INVADER_SPEED = 50
let CURRENT_SPEED = INVADER_SPEED
const LEVEL_DOWN = 40
const BULLET_SPEED = 200
const TIME_LEFT = 50

layer(['obj', 'ui'], 'obj')

addLevel([
  '!^^^^^^^^^^^^^^^^^^^^^^^^^^         &',
  '!^^^^^^^^^^^^^^^^^^^^^^^^^^         &',
  '!^^^^^^^^^^^^^^^^^^^^^^^^^^         &',
  '!                                   &',
  '!                                   &',
  '!                                   &',
  '!                                   &',
  '!                                   &',
  '!                                   &',
  '!                                   &',
  '!                                   &',
  '!                                   &',
  '!                                   &',
  '!                                   &',
  '!                                   &',
  '!                                   &',
  '!                                   &',
  '!                                   &',
  '!                                   &',
  '!                                   &',
  '!                                   &',
  '!                                   &',
  '!                                   &',
  '!                                   &',
], {
    width: 30,
    height: 22,
    '^': [sprite('space-invader'), scale(0.7), 'space-invader'],
    '!': [sprite('wall'), 'left-wall'],
    '&': [sprite('wall'), 'right-wall']
  })

const player = add([
  sprite('space-ship'),
  pos(width() / 2, height() / 1.10),
  origin('center')
])

keyDown('left', () => {
  player.move(-MOVE_SPEED, 0)
})

keyDown('right', () => {
  player.move(MOVE_SPEED, 0)
})

keyDown('down', () => {
  player.move(0, MOVE_SPEED)
})

keyDown('up', () => {
  player.move(0, -MOVE_SPEED,)
})

function spawnBullet(p){
  add([
    sprite('bullet'),
    pos(p),
    origin('center'),
    'bullet'
  ])
}

keyPress('space', () => {
  spawnBullet(player.pos.add(0, -25))
})

action('bullet', (b) => {
  b.move(0, -BULLET_SPEED)
  if(b.pos.y < 0){
    destroy(b)
  }
})

function destroyBullet (b){
  const obj = add([
    sprite('destroy'), pos(b), 'destroyed'
  ])
  wait(0.10, () => {
    destroy(obj)
  })
}

collides('bullet', 'space-invader', (b,s) => {
  destroyBullet(b.pos)
  camShake(5)
  destroy(b)
  destroy(s)
  score.value++
  score.text = score.value
})

const score = add([
  text('0'),
  pos(400, 20),
  layer('ui'),
  scale(3),
  {
    value: 0,
  }
])


const timer = add([
  text('0'),
  pos(404, 50),
  scale(2),
  layer('ui'),
  {
    time: TIME_LEFT,
  },
])

timer.action(() => {
  timer.time -= dt()
  timer.text = timer.time.toFixed(3)
  if (timer.time <= 0) {
    go('lose', {score: score.value})
  }
})

action('space-invader', (s) => {
  s.move(CURRENT_SPEED, 0)
})

collides('space-invader', 'right-wall', () => {
  CURRENT_SPEED = -INVADER_SPEED
  every('space-invader', (s) => {
    s.move(0, LEVEL_DOWN)
  })
})

collides('space-invader', 'left-wall', () => {
  CURRENT_SPEED = INVADER_SPEED
  every('space-invader', (s) => {
    s.move(0, LEVEL_DOWN)
  })
})

player.overlaps('space-invader', () => {
  go('lose', {score: score.value})
})