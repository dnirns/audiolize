import P5Wrapper from 'react-p5-wrapper'

const Terrain = ({ volume, sync }) => {
  const sketch = (p) => {
    const w = window.innerWidth * 1.5
    const h = window.innerHeight
    let rows = 0
    let cols = 0
    const scale = 30
    let terrain = []
    let flyingSpeed = 1
    let tempo = false

    //*color variables

    const red1 = '#a50505'
    const red2 = '#ff0000'

    const orange1 = '#ff8400'

    const pink1 = '#ff0059'
    const pink2 = '#ff00cc'

    const purple1 = '#bd01da'
    const purple2 = '#9201da'
    const purple3 = '#5401da'

    const blue1 = '#1e01da'
    const blue2 = '#013fda'
    const blue3 = '0175da'

    const turqouise1 = '#01a7da'
    const turqouise2 = '#01d3da'

    const green1 = '#01da75'
    const green2 = '#01da3f'
    const green3 = '#66da01'

    const yellow1 = '#b6da01'
    const yellow2 = '#ffff76'
    // const yellow3 = '#fefea0'

    p.setup = function setup() {
      p.createCanvas(w, h, p.WEBGL)

      //*set number of columns and rows to width / height divided by the scale of each triangle

      cols = w / scale
      rows = h / scale

      //*set audio source volume
    }

    p.draw = function draw() {
      let treble = volume.current * 40
      let bass = volume.current * 80

      //* on each beat change, toggle 'tempo' true / false

      //*assign energy values to variables to be used in terrain generation

      let depth
      let height

      //* use tempo change to effect values of depth and height
      sync.current.on('beat', (beat, lastBeat) => {
        if (beat.index !== lastBeat.index) {
          tempo = !tempo
        }
      })

      if (tempo) {
        depth = -bass * 2.5
        height = treble * 3.5
      } else {
        depth = -bass
        height = treble
      }

      //*alter flyingspeed based on volume level

      flyingSpeed -= volume.current / 10

      let yoff = flyingSpeed
      for (let y = 0; y < rows; y++) {
        let xoff = 0
        terrain[y] = []

        for (let x = 0; x < cols; x++) {
          terrain[y][x] = p.map(p.noise(xoff, yoff), 0, 1, height, depth)
          xoff += 0.1
        }
        yoff += 0.1
      }
      p.background('#191414')

      let strokeColor

      height < 10
        ? (strokeColor = red1)
        : height > 10 && height < 30
        ? (strokeColor = red2)
        : height > 30 && height < 50
        ? (strokeColor = orange1)
        : height > 50 && height < 70
        ? (strokeColor = yellow1)
        : height > 70 && height < 90
        ? (strokeColor = yellow2)
        : height > 90 && height < 110
        ? (strokeColor = pink1)
        : height > 110 && height < 130
        ? (strokeColor = pink2)
        : height > 130 && height < 150
        ? (strokeColor = purple1)
        : height > 150 && height < 170
        ? (strokeColor = purple2)
        : height > 170 && height < 190
        ? (strokeColor = purple3)
        : height > 190 && height < 210
        ? (strokeColor = blue1)
        : height > 210 && height < 220
        ? (strokeColor = blue2)
        : height > 220 && height < 230
        ? (strokeColor = blue3)
        : height > 230 && height < 250
        ? (strokeColor = turqouise1)
        : height > 250 && height < 270
        ? (strokeColor = turqouise2)
        : height > 270 && height < 280
        ? (strokeColor = green1)
        : height > 280 && height < 290
        ? (strokeColor = green2)
        : height > 290 && height < 300
        ? (strokeColor = green2)
        : (strokeColor = green3)

      p.stroke(strokeColor)
      p.strokeWeight(4)

      p.fill(0)

      //* rotate sketch along x axis
      p.rotateX(p.PI / 3.8)

      //* move sketch to align center after the rotation
      p.translate(-w / 1.4, -h / 2 + 50)
      //* loop to draw grid of triangles
      for (let y = 0; y < rows - 1; y++) {
        p.beginShape(p.TRIANGLE_STRIP)

        for (let x = 0; x < cols; x++) {
          //* drawing triangles by adding x + y vertex
          p.vertex(x * scale, y * scale, terrain[y][x])
          p.vertex(x * scale, (y + 1) * scale, terrain[y + 1][x])
        }
        p.endShape()
      }
    }
  }

  return <P5Wrapper sketch={sketch} />
}

export default Terrain
