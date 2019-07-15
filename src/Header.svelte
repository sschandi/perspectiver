<style>
.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: right;
  height: 250px;
  overflow: hidden;
  animation: header 2000ms ease-in;
}
.header-row {
  display: flex;
  align-items: center;
  justify-content: center;
}
.row-1 {
  transform: translateY(250px);
  animation: row-1 1000ms ease-in;
}
.row-3 {
  transform: translateY(-250px);
  animation: row-3 1000ms ease-in;
}
.title {
  background-color: var(--primary);
  transform: rotateX(60deg) rotateY(0) rotateZ(-45deg);
  writing-mode: vertical-rl;
  text-orientation: mixed;
  padding: 1rem 0.5rem;
  margin: 1rem;
  border-radius: 0.5rem;
  min-width: 200px;
  min-height: 400px;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  animation: perspective 1000ms ease-in;
}
.title-text {
  animation: title 1000ms ease-in;
}
.accent {
  background-color: var(--secondary);
  transform: rotateX(60deg) rotateY(0) rotateZ(-45deg);
  padding: 1rem 0.5rem;
  margin: 1rem;
  border-radius: 0.5rem;
  min-width: 200px;
  min-height: 400px;
  /* margin-right: -2rem; */
  box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
  animation: perspective 1000ms ease-in;
}
.accent-right-1 {
  transform: rotateX(60deg) rotateY(0) rotateZ(-45deg) translateX(100px);
}
.accent-right-2 {
  transform: rotateX(60deg) rotateY(0) rotateZ(-45deg) translateX(200px);
}
.accent-right-3 {
  transform: rotateX(60deg) rotateY(0) rotateZ(-45deg) translateX(300px);
}
.accent-left-1 {
  transform: rotateX(60deg) rotateY(0) rotateZ(-45deg) translateX(-300px);
}
.accent-left-2 {
  transform: rotateX(60deg) rotateY(0) rotateZ(-45deg) translateX(-200px);
}
.accent-left-3 {
  transform: rotateX(60deg) rotateY(0) rotateZ(-45deg) translateX(-100px);
}
h1 {
  color: var(--white);
  margin: 0;
  font-size: 4rem;
}
p {
  color: var(--white);
  margin: 0;
  font-size: 1.5rem;
}
@keyframes header {
  0% {
    height: 600px;
  }
  50% {
    height: 600px;
  }
  100% {
    height: 250px;
  }
}
@keyframes perspective-main {
  0% {
    transform: rotateZ(-90deg);
  }
  50% {
    transform: rotate(0);
  }
}
@keyframes title {
  from {
    top: 50%;
    left: 50vw;
  }
}
@keyframes perspective {
  from {
    transform: rotateX(0) rotateY(0) rotateZ(0);
  }
}
@keyframes row-1 {
  from {
    transform: translateY(0px);
  }
}
@keyframes row-3 {
  from {
    transform: translateY(0px);
  }
}
@keyframes accent-x {
  from {
    transform: translateX(0);
  }
}
</style>

<div class="header">
  <div class="header-row row-1">
    <div class="accent accent-left-1"/>
    <div class="accent accent-left-2"/>
    <div class="accent accent-left-3"/>
    <div class="accent"/>
    <div class="accent accent-right-1"/>
    <div class="accent accent-right-2"/>
    <div class="accent accent-right-3"/>
  </div>
  <div class="header-row row-2">
    <div class="accent accent-left-1"/>
    <div class="accent accent-left-2"/>
    <div class="accent accent-left-3"/>
    <div class="title">
      <h1 class="title-text">Perspective</h1>
    </div>
    <div class="accent accent-right-1"/>
    <div class="accent accent-right-2"/>
    <div class="accent accent-right-3"/>
  </div>
  <div class="header-row row-3">
    <div class="accent accent-left-1"/>
    <div class="accent accent-left-2"/>
    <div class="accent accent-left-3"/>
    <div class="accent"/>
    <div class="accent accent-right-1"/>
    <div class="accent accent-right-2"/>
    <div class="accent accent-right-3"/>
  </div>
</div>