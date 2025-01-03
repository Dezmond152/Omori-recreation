class Person extends GameObject {
  constructor(config) {
    super(config);
    this.movingProgressRemaining = 0;
    this.isPlayerControled = config.isPlayerControled || false;
    this.directionUpdate = {
      up:     ["y",-1],
      down:   ["y", 1],
      left:   ["x",-1],
      right:  ["x", 1],
    };
  }

  update(state) {
    if (this.movingProgressRemaining > 0) {
      this.updatePosition(state);
    } else {
      if (this.isPlayerControled && state.arrow) {
        this.startBehavior(state, {
          type: "walk",
          direction: state.arrow,
        });
      }
      this.updateSprite(state);
    }
  }

  startBehavior(state, behavior) {
    this.direction = behavior.direction;
    if (behavior.type === "walk") {
      if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {
        return;
      }
      state.map.moveWall(this.x, this.y, this.direction);
      this.movingProgressRemaining = 8; // 4/8/16
    }
  }

  updatePosition(state) {
    const [property, change] = this.directionUpdate[this.direction];
    this[property] += change * 4; // 8/4/2
    this.movingProgressRemaining -= 1;


    //----------------------------------------------
    if (this.movingProgressRemaining === 0) {
      let playerX = this.x;
      let playerY = this.y;
      let trigger = "onStepTrigger";
      state.map.checkTrigger(playerX, playerY, trigger);
      // console.log(state.map);
    }
    //----------------------------------------------
  }
  

  updateSprite(state) {
    if (this.movingProgressRemaining > 0) {
      this.sprite.setAnimation("walk-" + this.direction);
      return;
    }
    this.sprite.setAnimation("idle-" + this.direction);
  }
}
