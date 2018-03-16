var app = function (id) {
    var el = document.getElementById(id);
    this.clentW = document.body.clientWidth;
    this.clentH = document.body.clientHeight;
    el.width = this.clentW;
    el.height = this.clentH;
    var ctx = el.getContext('2d');
    this.init(ctx, Math.floor((Math.random() * 3) + 3));
}
app.prototype = {
    init: function (ctx, num) {
        var starGroup = [];
        for (var i = 0; i < num; i += 1) {
            starGroup.push(this.setStar());
        }
        this.run(ctx, starGroup);
    },
    setStar: function () { // 生成图案对象
        var star = {};
        var me = this;
        star.items = []; // 圆球对象
        // star.color = '#f2f2f2';
        star.itemLen = Math.floor((Math.random() * 2) + 4); // 圆球个数
        for (var i = 0; i < star.itemLen; i += 1) {
            star.items.push({
                x: Math.floor(Math.random() * this.clentW), // 圆心x坐标
                y: Math.floor(Math.random() * this.clentH), // 圆心y坐标
                l: Math.floor((Math.random() * 10) + 10), // 圆半径
                moveAngle: Math.floor(360 * Math.random()), // 移动弧度
                color: this.setColor(),
            });
        }
        return star;
    },
    linkline: function (ctx, items) { // 连接球体
        if (items.length === 0) {
            return;
        }
        const { x: x0, y: y0 } = items[0];
        ctx.beginPath();
        items.forEach(function(item, i) {
            if (i !== 0) {
                const { x, y } = item;
                ctx.moveTo(x0, y0);
                ctx.lineTo(x, y);
            }
        });
        ctx.closePath();
        ctx.stroke();
        this.linkline(ctx, items.slice(1));
    },

    drawStar: function (ctx,  data) { // 画出球体
        var items = data.items,
            color = data.color;
        items.forEach(function(item) {
            ctx.fillStyle = item.color;
            ctx.beginPath();
            ctx.arc(item.x, item.y, item.l, 0, 2 * Math.PI, true);
            ctx.closePath();
            ctx.fill();
        });
        ctx.strokeStyle = color;
        // this.linkline(ctx, items);
    },

    setColor: function () { // 随机上色
        const colorArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'];
        let color = '#';
        for (let i = 0; i < 6; i += 1) {
            color += colorArray[Math.floor(Math.random() * 16)];
        }
        return color;
    },

    run: function (ctx, starGroup) { // 运动球体、碰撞检测
        var back = [];
        var me = this;
        ctx.clearRect(0, 0, this.clentW, this.clentH);
        starGroup.forEach(function(item) {
            me.drawStar(ctx, item);
            var speed = 4;
            var backItem = {
                items: [],
            };

            item.items.forEach(function(s) {
                var {
                    moveAngle, x, y, l, color,
                } = s;
                var backS = {
                    moveAngle: moveAngle % 360, x, y, l, color,
                };
                var moveY = Math.sin((s.moveAngle / 180) * Math.PI) * speed;
                if ((s.moveAngle >= 0 && s.moveAngle < 90) || (s.moveAngle >= 270 && s.moveAngle < 360)) {
                    backS.x = x + speed;
                } else {
                    backS.x = x - speed;
                }
                backS.y = y - moveY;
                if (
                    (backS.x - backS.l) < 0 ||
                    (backS.x + backS.l) > me.clentW ||
                    (backS.y - backS.l) < 0 ||
                    (backS.y + backS.l) > me.clentH
                ) {
                    if ((backS.x - backS.l) <= 0) {
                        backS.x = backS.l;
                        if (backS.moveAngle >= 90 && backS.moveAngle < 180) {
                            backS.moveAngle -= (backS.moveAngle % 90) * 2;
                        } else {
                            backS.moveAngle += ((90 - (backS.moveAngle % 90)) * 2);
                        }
                    } else if ((backS.x + backS.l) >= me.clentW) {
                        backS.x = me.clentW - backS.l;
                        if (backS.moveAngle >= 0 && backS.moveAngle < 90) {
                            backS.moveAngle += ((90 - backS.moveAngle) * 2);
                        } else {
                            backS.moveAngle -= (backS.moveAngle % 90) * 2;
                        }
                    } else if ((backS.y - backS.l) <= 0) {
                        backS.y = backS.l;
                        if (backS.moveAngle > 0 && backS.moveAngle <= 90) {
                            backS.moveAngle += ((90 - backS.moveAngle) * 2) + 180;
                        } else {
                            backS.moveAngle -= ((backS.moveAngle % 90) * 2) - 180;
                        }
                    } else if ((backS.y + backS.l) >= me.clentH) {
                        backS.y = me.clentH - backS.l;
                        if (backS.moveAngle > 180 && backS.moveAngle <= 270) {
                            backS.moveAngle -= (backS.moveAngle % 90) * 2;
                        } else {
                            backS.moveAngle = 90 - (backS.moveAngle % 90);
                        }
                    }
                }
                backItem.items.push(backS);
            });
            back.push(backItem);
        });
        requestAnimationFrame(this.run.bind(this, ctx, back));
    }
}