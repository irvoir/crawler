<template>
  <section class="container">
    <div class="context">
      <div class="stripes">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
    <div class="content">
      <div class="tah">
        <div class="t">
          <span class="tlo" v-text="y"></span>
          <span class="tlt" v-text="x"></span>
        </div>
        <div class="h">
          <span class="sc">{{info}}</span>
          <span class="sc"></span>
          <span class="sc">{{sco}}</span>
          <span class="sc">{{scot}}</span>
          <span class="sc">{{scoth}}</span>
          <span class="sc"></span>
        </div>
      </div>
      <div class="di">
        <div class="dil">
          <div class="inp">
            <div class="inpt">{{inpt}}</div>
            <div class="inpu">
              <input v-validate="'required|url'" type="text" name="url" placeholder="▪ HTTPS" :class="{'input': true, 'is-danger': errors.has('url') }"
              @click="select($event)" v-model='url'>
            </div>
            <div class="inpd">
              <input v-validate="'between:0,1'" type="text" name="depth" placeholder="▪ DEPTH" :class="{'input': true, 'is-danger': errors.has('dep') }"
              @click="select($event)" v-model='dep'>
            </div>
            <div class="inpe" v-bind:class="{ 'invalid': showing }">{{ guide }}</div>
            <div class="inps" @click="validateForm">{{sub}}</div>
            <div class="inpde"></div>
          </div>
        </div>
        <div class="dir">
          <div class="out">
            <div class="outt">
              {{out}}
            </div>
            <div class="lin">
              <span>{{lin}}</span>
              <span class="st">{{links}}</span>
            </div>
            <div class="scr">
              <span>{{scr}}</span>
              <span class="st">{{scripts}}</span>
            </div>
            <div class="img">
              <span>{{img}}</span>
              <span class="st">{{images}}</span>
            </div>
            <div class="tim">
              <span>{{tim}}</span>
              <span class="st">{{seconds}}</span>
            </div>
          </div>
        </div>
      </div>
      <canvas id="concanvas"></canvas>
    </div>
  </section>
</template>

<script>

import Delaunay from 'delaunay-fast'
import axios from 'axios'
import store from '../store'

export default {
  data () {
    return {
      y: 'Website',
      x: `Crawler`,
      info: `The following app will download the website and display the following information:`,
      sco: `Number of absolute && relative links`,
      scot: `Number of JS scripts`,
      scoth: `Number of images`,
      inpt: `Input`,
      sub: `SUBMIT`,
      out: `Output`,
      lin: `⩇ Links`,
      scr: `⪤ Scripts`,
      img: `∷ Images`,
      tim: `⋖ Time`,
      url: null,
      dep: 0,
      showing: false
    }
  },
  methods: {
    select (event) {
      if (event.target.name === 'url') {
        store.commit('input', 'Use HTTP:// or HTTPS:// protocols')
        this.showing = false
      } else if (event.target.name === 'depth') {
        store.commit('input', 'Depth level: 0 or 1')
        this.showing = false
      }
    },
    validateForm () {
      if (this.url == null) {
        store.commit('input', 'Please insert an actual website.')
        this.showing = true
      }
      if (this.dep == null) {
        store.commit('depth', '0')
      }
      this.$validator.validateAll({
        url: this.url,
        dep: this.dep
      }).then(async (result) => {
        store.commit('update')
        if (result) {
          store.commit('depth', this.dep)
          this.showing = false
          try {
            await axios.get('http://localhost:8000/crawler', {
              headers: { 'web': this.url, 'dep': this.dep }
            }).then((response) => {
              store.commit('url', response.data.content)
            })
            return
          } catch (e) {
            console.error('More errs!')
            this.showing = true
          }
        }
        console.error('Errors!!')
        this.showing = true
      })
    }
  },
  computed: {
    links: function () {
      return this.$store.state.links
    },
    scripts: function () {
      return this.$store.state.scripts
    },
    images: function () {
      return this.$store.state.images
    },
    seconds: function () {
      return this.$store.state.seconds
    },
    error: function () {
      return this.$store.state.error
    },
    guide: function () {
      return this.$store.state.guide
    }
  },
  mounted: function () {
    /*eslint-disable */
    const canvas = document.getElementById('concanvas')
    const context = canvas.getContext('2d')
    let pc = 20
    let motion = 0.01
    let color = 'rgba(150, 150, 150, 0.35)'
    let lineWidth = 1
    let lc = 75
    let lm = 7
    let lo = 0.85
    let lf = 90
    let linkSpeed = 0.25
    let rl = true
    let bs = 0
    let rm = true
    let nl = 1000
    let ns = 1
    let minLink = 5
    let mouse = {x: 0, y: 0}
    let full = {lw: .25, ss: 'black', ds: 1, fs: 'black'}
    let dim = {lw: .5, ss: 'black', ds: .5, fs: 'black'}
    let m = {}
    let r = 0
    let c = 1000
    let n = 0
    let angle = (Math.PI * 10) / nl
    let radi = 100
    let posi = {x: 0, y: 0}
    let points = []
    let vertices = []
    let triangles = []
    let links = []
    let part = []
    function init () {
      let i, j, k
      window.requestAnimFrame = (function () {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame ||
          function (callback) {
            window.setTimeout(callback, 1000 / 30)
          }
      })();
      resize()
      mouse.x = canvas.clientWidth / 2
      mouse.y = canvas.clientHeight / 2

      for (i = 0; i < pc; i++) {
        let Particle = function () {
          this.x = random(-0.1, 1.1, true)
          this.y = random(-0.1, 1.1, true)
          this.z = random(0, 4)
          this.neighbors = []
        }
        let p = new Particle()
          part.push(p)
          points.push([p.x * c, p.y * c])
        }
      let vertices = Delaunay.triangulate(points);
      let tri = []
      for (i = 0; i < vertices.length; i++) {
        if (tri.length == 3) {
          triangles.push(tri)
          tri = []
        }
        tri.push(vertices[i])
      }
      for (i = 0; i < part.length; i++) {
        for (j = 0; j < triangles.length; j++) {
          k = triangles[j].indexOf(i)
          if (k !== -1) {
            triangles[j].forEach(function (value, index, array) {
              if (value !== i && part[i].neighbors.indexOf(value) == -1) {
                part[i].neighbors.push(value)
              }
            })
          }
        }
      }
      (function animloop () {
        requestAnimFrame(animloop)
        resize()
        render()
      })()
    }
    function render () {
      if (rm) {
        n++;
        if (n >= nl) {
          n = 0
        };
        posi = noisePoint(n);
      }
      context.clearRect(0, 0, canvas.width, canvas.height)
      if (bs > 0) {
        context.shadowBlur = bs
        context.shadowColor = '#b95'
      }
      if (rl) {
        if (random(0, lc) == lc) {
          let length = random(minLink, lm)
          let start = random(0, part.length - 1)
          startLink(start, length)
        }
        for (let l = links.length - 1; l >= 0; l--) {
          if (links[l] && !links[l].finished) {
            links[l].render()
          } else {
            delete links[l]
          }
        }
      }
      context.beginPath();
      context.stroke();
    }
    function resize () {
      canvas.width = window.innerWidth * (window.devicePixelRatio || 1)
      canvas.height = canvas.width * (canvas.clientHeight / canvas.clientWidth)
    }
    function startLink (vertex, length) {
      links.push(new Link(vertex, length))
    }
    let Link = function (startVertex, numPoints) {
      this.length = numPoints
      this.verts = [startVertex]
      this.stage = 0
      this.linked = [startVertex]
      this.distances = []
      this.traveled = 0
      this.fade = 0
      this.finished = false
    }
    Link.prototype.render = function () {
      let i, p, pos, points
      switch (this.stage) {
        case 0:
          let last = part[this.verts[this.verts.length - 1]]
          if (last && last.neighbors && last.neighbors.length > 0) {
              let neighbor = last.neighbors[random(0, last.neighbors.length - 1)]
              if (this.verts.indexOf(neighbor) == -1) {
                this.verts.push(neighbor)
              }
            } else {
              this.stage = 3
              this.finished = true
            }
            if (this.verts.length >= this.length) {
              for (i = 0; i < this.verts.length - 1; i++) {
                let p1 = part[this.verts[i]]
                let p2 = part[this.verts[i + 1]]
                let dx = p1.x - p2.x
                let dy = p1.y - p2.y
                let dist = Math.sqrt(dx * dx + dy * dy)
                this.distances.push(dist)
              }
              this.stage = 1
            }
        break
        case 1:
          if (this.distances.length > 0) {
            points = []
            for (i = 0; i < this.linked.length; i++) {
              p = part[this.linked[i]]
              pos = position(p.x, p.y, p.z)
              points.push([pos.x, pos.y])
            }
            let linkSpeedRel = linkSpeed * 0.00001 * canvas.width
            this.traveled += linkSpeedRel
            let d = this.distances[this.linked.length - 1]
            if (this.traveled >= d) {
              this.traveled = 0
              this.linked.push(this.verts[this.linked.length])
              p = part[this.linked[this.linked.length - 1]]
              pos = position(p.x, p.y, p.z)
              points.push([pos.x, pos.y])
              if (this.linked.length >= this.verts.length) {
                this.stage = 2
              }
            } else {
              let a = part[this.linked[this.linked.length - 1]]
              let b = part[this.verts[this.linked.length]]
              let t = d - this.traveled
              let x = ((this.traveled * b.x) + (t * a.x)) / d
              let y = ((this.traveled * b.y) + (t * a.y)) / d
              let z = ((this.traveled * b.z) + (t * a.z)) / d
              pos = position(x, y, z)
              points.push([pos.x, pos.y])
            }
            this.drawLine(points)
          } else {
            this.stage = 3
            this.finished = true
          }
        break
        case 2:
          if (this.verts.length > 1) {
            if (this.fade < lf) {
              this.fade++
              points = []
              let alpha = (1 - (this.fade / lf)) * lo
              for (i = 0; i < this.verts.length; i++) {
                p = part[this.verts[i]]
                pos = position(p.x, p.y, p.z)
                points.push([pos.x, pos.y])
              }
              this.drawLine(points, alpha)
            } else {
              this.stage = 3
              this.finished = true
            }
          } else {
            this.stage = 3
            this.finished = true
          }
        break
        case 3:
        default:
          this.finished = true
        break
      }
    }
    Link.prototype.drawLine = function (points, alpha) {
      if (typeof alpha !== 'number') alpha = lo
      if (points.length > 1 && alpha > 0) {
        context.globalAlpha = alpha
        context.beginPath()
        for (let i = 0; i < points.length - 1; i++) {
          context.moveTo(points[i][0], points[i][1])
          context.lineTo(points[i + 1][0], points[i + 1][1])
        }
        context.strokeStyle = color
        context.lineWidth = lineWidth
        context.stroke()
        context.closePath()
        context.globalAlpha = 1
      }
    }
    function noisePoint (i) {
      let a = angle * i
      let cosA = Math.cos(a)
      let sinA = Math.sin(a)
      let rad = radi
      return {
        x: rad * cosA,
        y: rad * sinA
      }
    }
    function position (x, y, z) {
      return {
        x: (x * canvas.width) + ((((canvas.width / 2) - mouse.x + ((posi.x - 0.5) * ns)) * z) * motion),
        y: (y * canvas.height) + ((((canvas.height / 2) - mouse.y + ((posi.y - 0.5) * ns)) * z) * motion)
      }
    }
    function random (min, max, float) {
      return float
        ? Math.random() * (max - min) + min
        : Math.floor(Math.random() * (max - min + 1)) + min
    }
    if (canvas) init()
    /*eslint-enable */
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Hammersmith+One|Quicksand');
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
body {
  background: #eee;
  overflow-x: hidden;
}
.container {
  width: 100%;
  height: 100%;
  min-height: 500px;
  overflow: hidden;
  position: relative;
  background: radial-gradient(ellipse farthest-corner at 45% 50%, #bbc0ce, #003545);
  display: grid;
  position: relative;
  grid-template: "content" 1fr;
}
.context .stripes {
  display: grid;
  grid-template-rows: repeat(5, 200px);
  grid-template-columns: repeat(10, 1fr);
}
.context .stripes :nth-child(1) {
  grid-column: span 6;
  background: linear-gradient(to left, transparent, transparent, #003545);
  filter: blur(2px);
}
.context .stripes :nth-child(2) {
  grid-area: 3 / span 7 / auto / -1;
  background: linear-gradient(to left, transparent, #003545);
  border: 1px solid rgba(0,0,0, 0.65);
  border-right: none;
  filter: blur(2px);
}
.context .stripes :nth-child(3) {
  grid-row: 4;
  grid-column: span 3;
  background: linear-gradient(to right, transparent, #003545 90%);
  filter: blur(2px);
  border: 1px solid rgba(0,0,0, 0.65);
  border-left: none;
}
.context .stripes :nth-child(4) {
  grid-row: 4;
  grid-column: span 3;
  grid-area: 5 / span 10 / auto / -1;
  background: radial-gradient(ellipse farthest-corner at 100% 100%, #003545, transparent, transparent);
  filter: blur(2px);
  border-bottom: 1px solid rgba(0,0,0, 0.65);
}
.context .stripes :nth-child(5) {
  grid-area: 2 / span 2 / auto / -1;
  position: relative;
  background: linear-gradient(to right, transparent 30%, #003545);
  background-repeat: repeat;
  transform:  skewY(-15deg);
  filter: blur(1px);
  border: 1px solid rgba(0,0,0, 0.45);
}
.context .stripes {
  transform: skewY(-5deg);
  transform-origin: 0;
}
.context {
  position: absolute;
  width: 100%;
  height: 100%;
  content: "";
  left: 0;
}
.content{
  grid-area: content;
  position: relative;
  background: #003545;
  width: 85vw;
  height: 85vh;
  justify-self: center;
  align-self: center;
  box-shadow: -1px 22px 26px -8px rgba(0,0,0,0.45);
  display: grid;
  grid-template-rows: 2fr 8fr;
  grid-template-columns: 1fr;
  grid-template-areas: "tah" "di";
  margin: 0 auto;
}
.tah {
  grid-area: tah;
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: 3fr 9fr;
  grid-template-areas: "t h";
}
.t {
  grid-area: t;
  font-family: 'Hammersmith One', serif;
  font-size: 2em;
  color: #8898aa;
  letter-spacing: 3px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 2fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-template-areas:
  ". tlo tlo ."
  ". . tlt tlt";
  align-items: end;
}
.tlo {
  grid-area: tlo;
  justify-self: end;
  align-self: end;
  background: black;
  padding: 0 5px 0 5px;
}
.tlt {
  grid-area: tlt;
  align-self: start;
  justify-self: start;
  background: #b95;
  color: black;
  padding: 0 5px 0 5px;
}
.h {
  grid-area: h;
  display: grid;
  grid-template-rows: repeat(10, 1fr);
  grid-template-columns: repeat(20, 1fr);
}
.sc{
  font-family: 'Quicksand', serif;
  font-size: 1.3em;
  color: #CFD3D6;
  white-space: nowrap;
  position: relative;
  z-index: 5;
  -webkit-user-select: none;
  cursor: default;
}
.sc:nth-child(1) {
  grid-row: 3 / span 2;
  grid-column: 4 / span 14;
  background: #89c2da;
  color: #3b6a7d;
  opacity: 0.65;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
}
.sc:nth-child(2) {
  grid-row: 6 / span 1;
  grid-column: 2 / span 18;
  border-top: 1px solid #3b6a7d;
  position: relative;
}
.sc:nth-child(2):before {
  position: absolute;
  content: "";
  top: -50%;
  width: 99.9%;
  height: 100%;
  border-left: 1px solid #3b6a7d;
  border-right: 1px solid #3b6a7d;
}
.sc:nth-child(3) {
  grid-row: 8 / span 2;
  grid-column: 3 / span 6;
  background: #112732;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  position: relative;
  box-shadow: none;
  transition: all 1s ease-in-out;
}
.sc:nth-child(3):after,
.sc:nth-child(4):after,
.sc:nth-child(5):after{
  transition: opacity 1s ease-in-out;
  opacity: 0;
}
.sc:hover:nth-child(3):after,
.sc:hover:nth-child(4):after,
.sc:hover:nth-child(5):after {
  position: absolute;
  opacity: 1;
  content: "⧐";
  color: #b95;
  left: -4%;
}
.sc:hover:nth-child(3),
.sc:hover:nth-child(4),
.sc:hover:nth-child(5) {
  color: #b95;
  box-shadow: -1px 22px 26px -8px rgba(0,0,0,0.25);
}
.sc:nth-child(4) {
  grid-row: 8 / span 2;
  grid-column: 10 / span 4;
  background: #112732;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  box-shadow: none;
  transition: all 1s ease-in-out;
}
.sc:nth-child(5) {
  grid-row: 8 / span 2;
  grid-column: 15 / span 4;
  background: #112732;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  box-shadow: none;
  transition: all 1s ease-in-out;
}
.sc:nth-child(6) {
  grid-row: 8 / span 2;
  grid-column: 2 / span 1;
  position: relative;
}
.sc:nth-child(6):after {
  display: block;
  position: absolute;
  content: "";
  left: 10%;
  width: 15%;
  height: 100%;
  border-left: 4px solid rgba(187, 153, 85, 0.55);
  border-right: 8px solid rgba(187, 153, 85, 0.55);
}
.di {
  grid-area: di;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto;
  grid-template-areas: "dil dir";
}
.dir {
  grid-area: 'dir';
  display: grid;
  grid-template-columns: 1fr 3fr 2fr;
  grid-template-rows: 1fr 3fr 1fr;
  grid-template-areas: ". . ." ". out ." ". . .";
}
.out {
  grid-area: out;
  z-index: 5;
  background: linear-gradient(to right, rgba(17, 39, 50, 0.9), rgba(17, 39, 50, 0.9)), url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5IiBoZWlnaHQ9IjkiPgo8cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9IiM1NTU1NTUiPjwvcmVjdD4KPHJlY3Qgd2lkdGg9IjgiIGhlaWdodD0iOCIgZmlsbD0iIzQ2NDIzOSI+PC9yZWN0Pgo8L3N2Zz4=") repeat;
  box-shadow: -1px 22px 26px -8px rgba(0,0,0,0.25);
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(10, 1fr);
  position: relative;
  font-family: 'Quicksand', serif;
  color: #3b6a7d;
  letter-spacing: 3px;
  -webkit-user-select: none;
  cursor: default;
}
.out:after {
  display: block;
  position: absolute;
  content: "";
  width: 99%;
  height: 99%;
  right: 0;
  border-right: 3px solid #112732;
  border-bottom: 3px solid #112732;
}
.out:before {
  display: block;
  position: absolute;
  content: "⚈";
  right: 5px;
  bottom: 5px;
  font-size: 1.3em;
  color: #8898aa;
}
.lin {
  grid-row: 3 / span 1;
  grid-column: 1 / span 10;
  z-index: 5;
  font-size: 1.4em;
  padding: 0 25px 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
}
.scr {
  grid-row: 5 / span 1;
  grid-column: 1 / span 10;
  z-index: 5;
  font-size: 1.4em;
  padding: 0 25px 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
}
.img {
  grid-row: 7 / span 1;
  grid-column: 1 / span 10;
  z-index: 5;
  font-size: 1.4em;
  padding: 0 25px 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
}
.tim {
  grid-row: 9 / span 2;
  grid-column: 1 / span 10;
  z-index: 5;
  font-size: 1.5em;
  padding: 0 8% 0 16px;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
}
.tim:before{
  display: block;
  position: absolute;
  content: "";
  width: 90%;
  height: 100%;
  top: 0;
  border-top: 1px solid #3b6a7d;
  left: 5%;
}
.dil {
  grid-area: 'dil';
  display: grid;
  grid-template-columns: 1fr 3fr 2fr;
  grid-template-rows: 1fr 3fr 1fr;
  grid-template-areas:
  ". . ."
  ". inp ."
  ". . .";
}
.inp {
  grid-area: inp;
  display: grid;
  grid-template-rows: repeat(10, 1fr);
  grid-template-columns: repeat(10, 1fr);
}
.inpde {
  grid-column: 1 / span 1;
  grid-row: 4 / span 3;
  position: relative;
}
.inpde:nth-child(6):after {
  display: block;
  position: absolute;
  content: "";
  left: 0 ;
  width: 20%;
  height: 100%;
  border-left: 4px solid rgba(187, 153, 85, 0.55);
  border-right: 8px solid rgba(187, 153, 85, 0.55);
}
.inpt, .outt {
  grid-column: 1 / span 10;
  grid-row: 1 / span 1;
  background: #4C4741;
  border-left: 6px solid #b95;
  z-index: 5;
  font-family: 'Quicksand', serif;
  font-size: 1.9em;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  padding-left: 10px;
  background: black;
  box-shadow: -1px 22px 26px -8px rgba(0,0,0,0.25);
  color: #8898aa;
  letter-spacing: 1.5px;
  -webkit-user-select: none;
  cursor: default;
}
.outt{
  box-shadow: none;
}
.inpu {
  background: #112732;
  z-index: 5;
  grid-column: 2 / span 9;
  grid-row: 4 / span 1;
  position: relative;
}
.inpu:after{
  display: block;
  position: absolute;
  content: "⨰";
  top: -25px;
  right: 5px;
  color: #3b6a7d;
  font-size: 1.2em;
}
.inpu:before{
  display: block;
  position: absolute;
  content: "⨪";
  top: -25px;
  right: 5px;
  color: #3b6a7d;
  font-size: 1.2em;
}
.inpu:hover:before{
  position: absolute;
  opacity: 1;
  width: 100%;
  height: 100%;
  content: "⧐";
  color: #b95;
  left: -4%;
  top: 18%;
  font-size: 1.3em;
  z-index: -1;
}
.inpd {
  background: #112732;
  z-index: 5;
  grid-column: 2 / span 9;
  grid-row: 6 / span 1;
  position: relative;
}
.inpd:after{
  display: block;
  position: absolute;
  content: "⨪";
  top: -25px;
  right: 5px;
  color: #3b6a7d;
  font-size: 1.2em;
}
.inpd:hover:before{
  position: absolute;
  opacity: 1;
  width: 100%;
  height: 100%;
  content: "⧐";
  color: #b95;
  left: -4%;
  top: 17%;
  font-size: 1.3em;
  z-index: -1;
}
.inpe {
  background: #112732;
  z-index: 5;
  grid-column: 2 / span 9;
  grid-row: 8 / span 1;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  font-family: 'Quicksand', serif;
  -webkit-user-select: none;
  cursor: default;
  color: #3b6a7d;
  font-size: 1.2em;
  position: relative;
}
.inpe:after{
  display: block;
  position: absolute;
  content: "⟐";
  top: -27px;
  right: 5px;
  color: #3b6a7d;
  font-size: 1.2em;
}
.inps {
  grid-column: 4 / span 5;
  grid-row: 10 / span 1;
  z-index: 5;
  background: linear-gradient(0deg, rgba(187, 153, 85, 0.9), rgba(187, 153, 85, 0.9));
  color: black;
  font-family: 'Quicksand', serif;
  font-size: 1.5em;
  letter-spacing: 5px;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  font-weight: bolder;
  cursor: pointer;
  position: relative;
  -webkit-user-select: none;
  box-shadow: -1px 22px 26px -8px rgba(0,0,0,0.25);
  transition-property: box-shadow;
  transition-duration: 1s;
}
.inps:hover {
  box-shadow: none;
}
.inps:after{
  display: block;
  position: absolute;
  font-size: 0.5em;
  content: "◾";
  right: 0;
  bottom: 0;
}
input[type='text'] {
  background: none;
  outline: none;
  border: none;
  display: block;
  width: 95%;
  height: 100%;
  color: #3b6a7d;
  font-size: 1.3em;
  padding-left: 10px;
}
::placeholder{
  color: #3b6a7d;
  font-size: 0.9em;
  padding-left: 5px;
}
#concanvas {
  position: absolute;
  width: 100%;
  height: 100%;
}
.st {
  font-weight: 500;
  color: #b95;
  white-space: nowrap;
  overflow: hidden;
}
@media not screen and (min-width: 1800px) {
  .sc:nth-child(1) {
    grid-row: 3 / span 2;
    grid-column: 3 / span 15;
  }
  .sc:nth-child(3) {
    grid-row: 7 / span 3;
    grid-column: 3 / span 6;
    font-size: 1.2em;
  }
  .sc:nth-child(4) {
    grid-row: 7 / span 3;
    grid-column: 10 / span 4;
    font-size: 1.2em;
  }
  .sc:nth-child(5) {
    grid-row: 7 / span 3;
    grid-column: 15 / span 4;
    font-size: 1.2em;
  }
  .sc:nth-child(6) {
    grid-row: 7 / span 3;
    grid-column: 2 / span 1;
    position: relative;
  }
  .dil, .dir {
    grid-template-columns: 1fr 4fr 2fr;
    grid-template-rows: 1fr 4fr 1fr;
  }
}
@media not screen and (min-width: 1700px) {
  .content {
    width: 86vw;
    height: 86vh;
  }
  .sc:nth-child(2) {
    grid-row: 6 / span 1;
    grid-column: 1 / span 19;
  }
  .sc:nth-child(1) {
    font-size: 1.15em;
  }
  .sc:nth-child(3),
  .sc:nth-child(4),
  .sc:nth-child(5) {
    font-size: 1.1em;
  }
}
@media not screen and (min-width: 1600px) {
  .content {
    width: 87vw;
    height: 87vh;
  }
  .sc:nth-child(1),
  .sc:nth-child(3),
  .sc:nth-child(4),
  .sc:nth-child(5) {
    font-size: 1.1em;
  }
}
@media not screen and (min-width: 1500px) {
  .sc:nth-child(3),
  .sc:nth-child(4),
  .sc:nth-child(5) {
    font-size: 0.95em;
  }
}
@media not screen and (min-width: 1400px) {
  .sc:nth-child(2) {
    display: none;
  }
  .t {
    grid-template-columns: 2fr 2fr 1fr 2fr 1fr;
    grid-template-rows: 1fr 1fr;
  }
}
@media not screen and (min-width: 1300px) {
  .tah {
    grid-template-columns: 1fr 5fr 2fr;
    grid-template-areas: ". t .";
  }
  .h {
    display: none;
  }
  .dir {
    grid-template-columns: 1fr 5fr 2fr;
    grid-template-rows: 1fr 4fr 1fr;
  }
}
@media not screen and (min-width: 1200px) {
  .dil {
    grid-template-columns: 1fr 5fr 2fr;
    grid-template-rows: 1fr 4fr 1fr;
  }
  .dir {
    grid-template-columns: 1fr 6fr 2fr;
    grid-template-rows: 1fr 4fr 1fr;
  }
}
@media not screen and (min-width: 1000px) {
  .dil {
    grid-template-columns: 1fr 8fr 1fr;
    grid-template-rows: 1fr 4fr 1fr;
  }
  .dir {
    grid-template-columns: 1fr 8fr 2fr;
    grid-template-rows: 1fr 4fr 1fr;
  }
}
.invalid {
  transition-duration: 1s;
  transition-property: all;
  background: #990000;
  opacity: 0.3;
  color: #CFD3D6;
}
</style>
