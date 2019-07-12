<style>
.header {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: right;
  height: 150px;
}
.title {
  background-color: var(--primary);
  transform: rotateX(60deg) rotateY(0) rotateZ(-45deg);
  writing-mode: vertical-rl;
  text-orientation: mixed;
  padding: 1rem 0.5rem;
  border-radius: 0.5rem;
  width: 200px;
  height: 400px;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}
.accent {
  background-color: var(--secondary);
  transform: rotateX(60deg) rotateY(0) rotateZ(-45deg);
  padding: 1rem 0.5rem;
  border-radius: 0.5rem;
  width: 200px;
  height: 400px;
  margin-right: -2rem;
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
</style>

<div class="header">
  <div class="accent">
  </div>
  <div class="title">
    <h1>Perspective</h1>
  </div>
</div>