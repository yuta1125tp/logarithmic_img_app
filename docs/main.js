// var cv = require("../libs/4.5.2/opencv.js");
// import { cv } from "../libs/4.5.2/opencv.js";
function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
}
function* range(from, to, step = 1) {
  while (from < to) {
    yield from;
    from += step;
  }
}

function product() {
  var args = Array.prototype.slice.call(arguments); // makes array from arguments
  return args.reduce(
    function tl(accumulator, value) {
      var tmp = [];
      accumulator.forEach(function (a0) {
        value.forEach(function (a1) {
          tmp.push(a0.concat(a1));
        });
      });
      return tmp;
    },
    [[]]
  );
}
function is_inside_circle(x, y, a, b, c, cx, cy) {
  return a * (x - cx) ** 2 + b * (y - cy) ** 2 - c ** 2 < 0;
}
function is_outside_circle(x, y, a, b, c, cx, cy) {
  return !is_inside_circle(x, y, a, b, c, cx, cy);
}

function xy_to_z(xy) {
  return xy.map((x) => math.complex(x[0], x[1]));
}
function z_to_xy(z) {
  return z.map((x) => [x.re, x.im]);
}

const RootComponent = {
  /* オプション */
  data() {
    return {
      initialized: false,
      inputfile: null,
      todos: [
        { text: "Learn JavaScript" },
        { text: "Learn Vue" },
        { text: "Build something awesome" },
      ],
      // count: 0,
      // times: 1,
      mousePosition: {
        x: 0,
        y: 0,
      },
      positionHistory: [],
      positionDict: {
        center_small: {
          x: 500 / 5,
          y: 500 / 5,
        },
        center_large: {
          x: 500 / 5,
          y: 500 / 5,
        },
        // anchor_small: {
        //   x: 500 / 5 + 150 / 5,
        //   y: 500 / 5,
        // },
        // anchor_large: {
        //   x: 500 / 5 + 400 / 5,
        //   y: 500 / 5,
        // },
      },
      mode: null,
      radius_marker: 5,
      // name: "Vue.js",
      // counter: 0,
      // groceryList: [
      //   { id: 0, text: "Vegetables" },
      //   { id: 1, text: "Cheese" },
      //   { id: 2, text: "Whatever else humans are supposed to eat" },
      // ],
      // count: 4,
      // rawHtml: '<span style="color: red">This should be red.</span>',
      // dynamicId: 1,
      // seen: true,
      // placeholder1: null,
      // placeholder2: undefined,
      radius_small: 20, //30,
      radius_large: 95, //80
      // radius_small: 30,
      // radius_large: 80,
      image_url:
        "https://cdn.pixabay.com/photo/2016/08/30/03/16/watercolor-1629721__340.jpg",
    };
  },
  computed: {
    multiplicationResult() {
      return this.count * this.times;
    },
    // radius_small() {
    //   if (
    //     this.positionDict["center_small"] &&
    //     this.positionDict["anchor_small"]
    //   ) {
    //     return (
    //       ((this.positionDict["center_small"].x -
    //         this.positionDict["anchor_small"].x) **
    //         2 +
    //         (this.positionDict["center_small"].y -
    //           this.positionDict["anchor_small"].y) **
    //           2) **
    //       0.5
    //     );
    //   }
    //   return null;
    // },
    // radius_large() {
    //   if (
    //     this.positionDict["center_large"] &&
    //     this.positionDict["anchor_large"]
    //   ) {
    //     return (
    //       ((this.positionDict["center_large"].x -
    //         this.positionDict["anchor_large"].x) **
    //         2 +
    //         (this.positionDict["center_large"].y -
    //           this.positionDict["anchor_large"].y) **
    //           2) **
    //       0.5
    //     );
    //   }
    //   return null;
    // },
  },
  onModeButtonReset(event) {
    this.radius_small = 20; //30;
    this.radius_large = 95; //80;
    this.positionDict.center_small.x = 100;
    this.positionDict.center_small.y = 100;
    this.positionDict.center_large.x = 100;
    this.positionDict.center_large.y = 100;
    this.positionHistory = [];
  },
  mounted() {
    cv["onRuntimeInitialized"] = () => {
      this.initialized = true;
    };
  },
  created() {
    // // `this` は vm インスタンスを指す
    // console.log("count is: " + this.count); // => "count is: 1"
  },
  methods: {
    load(canvasId, file) {
      return new Promise((resolve, reject) => {
        var canvas = document.getElementById(canvasId);
        var ctx = canvas.getContext("2d");
        var image = new Image();
        var reader = new FileReader();
        reader.onload = (e) => {
          image.onload = () => {
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            resolve(image);
          };
          image.src = e.target.result;
        };
        reader.readAsDataURL(file);
      });
    },
    async previewFiles(event) {
      this.inputfile = event.target.files[0];
      await this.load("input", this.inputfile);
    },
    onButtonLoadFromURL(event) {
      console.log(this.image_url);
      var canvas = document.getElementById("input");
      var ctx = canvas.getContext("2d");
      var image = new Image();
      image.onload = function () {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      };
      image.src = this.image_url;
      image.crossOrigin = "Anonymous";

      // await this.load("input", this.image_url);
    },
    onButtonAClick(event) {
      this.opencvRoutine(null);
    },
    opencvRoutine(event) {
      // this.show("input", "output");
      inputCanvasId = "input";
      outputCanvasId = "output";
      let src = cv.imread(inputCanvasId);

      height = src.rows;
      width = src.rows;
      let bg_color = new cv.Scalar(255, 255, 255);
      canvas = new cv.Mat(height, width, cv.CV_8UC3, bg_color);
      center = [width / 2, height / 2];
      console.log(center);
      console.log(width);
      console.log(height);
      console.log(canvas);

      if (false) {
        x_range = Array.from(range(0, width));
        y_range = Array.from(range(0, height));
      } else {
        x_range = Array.from(range(0, width));
        y_range = Array.from(range(0, height));
      }

      console.log(x_range);
      console.log(y_range);

      xy_list = product(x_range, y_range);
      xy_list_shift = xy_list.map((x) => [x[0] - center[0], x[1] - center[1]]);

      console.log("checkpointA");
      is_target_area_mask = new cv.Mat.zeros(height, width, cv.CV_8U);
      center_s = this.positionDict["center_small"];
      center_l = this.positionDict["center_large"];
      radius_s = this.radius_small;
      radius_l = this.radius_large;
      a_s = 1;
      b_s = 1;
      c_s = radius_s;
      a_l = 1;
      b_l = 1;
      c_l = radius_l;
      console.log(is_target_area_mask.isContinuous());
      console.log(center_s, center_l, radius_s, radius_l);
      for (const probe of product(y_range, x_range)) {
        row = probe[0];
        col = probe[1];
        // let pixel = is_target_area_mask.ucharPtr(col, row);
        // pixel[0] = 128;

        if (is_inside_circle(row, col, a_s, b_s, c_s, center_s.x, center_s.y)) {
          is_target_area_mask.ucharPtr(col, row)[0] = 0;
        } else if (
          is_outside_circle(row, col, a_l, b_l, c_l, center_l.x, center_l.y)
        ) {
          is_target_area_mask.ucharPtr(col, row)[0] = 128;
        } else {
          is_target_area_mask.ucharPtr(col, row)[0] = 255;
        }
      }
      console.log("~checkpointA");

      console.log("~checkpointB");
      // 角度のオフセット
      theta = 0;
      num_spiral = 1;
      alpha = Math.atan(
        (num_spiral * Math.log(radius_s / radius_l)) / (2 * Math.PI)
      );
      console.log("alpha", alpha);

      f = ((2 * Math.PI) / (2 * Math.PI - theta)) * Math.cos(alpha);
      console.log("f", f);
      beta = math.multiply(
        f,
        math.exp(math.multiply(math.complex(0, 1), alpha))
      );
      console.log("beta", beta);

      src_xy_ = xy_list.map((x) => [0, 0]);
      dst_xy_ = xy_list.map((x) => [0, 0]);
      eps = 1e-6;
      min_idx = 0;
      max_idx = 8;
      idx_list = Array.from(range(min_idx, max_idx));
      for (idx of idx_list) {
        console.log("idx=" + idx);
        if (false) {
          // // 順方向
          // z_src = xy_to_z(xy_list_shift + eps);
          // log_z =
          //   beta * (np.log(z_src / radius_s) - idx * (np.log(radius_s) - np.log(radius_l)));
          // z_dst = np.exp(log_z);
          // // z_dst = (z_src / radius_s) ** beta
          // xy_list2_shift = z_to_xy(z_dst);
          // xy_list2 = xy_list2_shift + center;
          // xy_list2 = xy_list2.astype(np.int);
          // src_xy = xy_list;
          // src_xy = (xy_list_shift + center).astype(np.int);
          // // dst_xy = xy_list2
          // dst_xy = np.clip(xy_list2, 0, min(canvas_height, canvas_width) - 1);
        } else {
          // 逆方向
          z_dst = xy_to_z(xy_list_shift.map((x) => [x[0] + eps, x[1] + eps]));
          partA = z_dst.map((x) => math.divide(math.log(x), beta));
          partB = idx * (math.log(radius_s) - math.log(radius_l));
          partC = math.log(radius_s);
          log_z = partA.map((x) =>
            math.add(x, math.complex(partB, 0), math.complex(partC, 0))
          );
          // log_z = (
          //     np.log(z_dst) / beta + idx * (np.log(radius_s) - np.log(radius_l)) + np.log(radius_s)
          // )
          if (true) {
            z_src = log_z.map((x) => math.exp(x));
            xy_list2_shift = z_to_xy(z_src);
            xy_list2 = xy_list2_shift.map((x) => [
              x[0] + center[0],
              x[1] + center[1],
            ]);
          } else {
            scale1 = 100;
            xy_list2 = z_to_xy(log_z).map((x) => [
              x[0] * scale1,
              x[1] * scale1,
            ]);
          }
          console.log("xy_list2", xy_list2[0]);
          src_xy = xy_list2.map((x) => [
            parseInt(clamp(x[0], 0, math.min(height, width) - 1)),
            parseInt(clamp(x[1], 0, math.min(height, width) - 1)),
          ]);
          console.log("src_xy", src_xy[0]);
          dst_xy = xy_list;
        }
        for (let idx2 = 0; idx2 < xy_list.length; idx2++) {
          p_src = src_xy[idx2];
          p_dst = dst_xy[idx2];
          col = p_src[0];
          row = p_src[1];

          if (is_target_area_mask.ucharPtr(col, row)[0] != 255) {
            continue;
          } else {
            if (idx2 == 0) {
              console.log("!!", idx2, p_src, p_dst);
            }
            src_xy_[idx2] = [p_src[0], p_src[1]];
            dst_xy_[idx2] = [p_dst[0], p_dst[1]];
          }
        }
      }
      for (let idx = 0; idx < xy_list.length; idx++) {
        const p_src = src_xy_[idx];
        const p_dst = dst_xy_[idx];
        if (idx < 10) {
          console.log(p_src, p_dst);
        }
        canvas.ucharPtr(p_dst[0], p_dst[1])[0] = src.ucharPtr(
          p_src[0],
          p_src[1]
        )[0];
        canvas.ucharPtr(p_dst[0], p_dst[1])[1] = src.ucharPtr(
          p_src[0],
          p_src[1]
        )[1];
        canvas.ucharPtr(p_dst[0], p_dst[1])[2] = src.ucharPtr(
          p_src[0],
          p_src[1]
        )[2];
      }

      cv.imshow(outputCanvasId, canvas);
      // cv.imshow(outputCanvasId, is_target_area_mask);
      src.delete();
      canvas.delete();
      is_target_area_mask.delete();
    },
    onModeButtonClick(mode) {
      console.log(mode);
      this.mode = mode;
    },
    onMouseMove(event) {
      var rect = event.currentTarget.getBoundingClientRect(),
        offsetX = event.clientX - rect.left,
        offsetY = event.clientY - rect.top;

      this.mousePosition.x = offsetX; //clientX;
      this.mousePosition.y = offsetY; //clientY;
    },
    onClickImage(event) {
      console.log("hoge");
      console.log(this.mousePosition);
      console.log(this.positionHistory);
      this.positionHistory.push({
        x: this.mousePosition.x,
        y: this.mousePosition.y,
      });
      if (this.mode !== null) {
        if (this.mode.startsWith("anchor_")) {
          if (this.mode.endsWith("_small")) {
            this.radius_small =
              ((this.mousePosition.x - this.positionDict["center_small"].x) **
                2 +
                (this.mousePosition.y - this.positionDict["center_small"].y) **
                  2) **
              0.5;
          } else if (this.mode.endsWith("_large")) {
            this.radius_large =
              ((this.mousePosition.x - this.positionDict["center_large"].x) **
                2 +
                (this.mousePosition.y - this.positionDict["center_large"].y) **
                  2) **
              0.5;
          }
        }
        this.positionDict[this.mode] = {
          x: this.mousePosition.x,
          y: this.mousePosition.y,
        };
      }
      // if (event.includes("center")) {
      //   // if (this.mode !== null) {
      //   this.positionDict[this.mode] = {
      //     x: this.mousePosition.x,
      //     y: this.mousePosition.y,
      //   };
      // }
    },
    // greet(event) {
    //   // メソッド内の `this` は、 Vue インスタンスを参照します
    //   alert("Hello " + this.name + "!");
    //   // `event` は、ネイティブ DOM イベントです
    //   if (event) {
    //     alert(event.target.tagName);
    //   }
    // },
    // increment() {
    //   this.count++;
    // },
    // click: _.debounce(function () {
    //   // ... クリックに反応 ...
    // }, 500),
  },
};

// Vue アプリケーションを生成する
const app = Vue.createApp(RootComponent);

// app.component("todo-item", {
//   props: ["todo"],
//   template: `<li>{{ todo.text }}</li>`,
// });

// app.component("save-button", {
//   created() {
//     // Lodash によるDebounce
//     this.debouncedClick = _.debounce(this.click, 500);
//   },
//   unmounted() {
//     // コンポーネントが削除されたらタイマーをキャンセル
//     this.debouncedClick.cancel();
//   },
//   methods: {
//     click() {
//       // ... クリックに反応 ...
//     },
//   },
//   template: `
//     <button @click="debouncedClick">
//       Save
//     </button>
//   `,
// });

// Vue アプリケーションをマウントする
const vm = app.mount("#app");

// console.log(vm.count); // => 4
// console.log(vm.$data.count); // => 4
// console.log(vm.count); // => 4

// // vm.count に値を代入すると、 $data.count も更新
// vm.count = 5;
// console.log(vm.$data.count); // => 5

// // ... 逆もまた同様
// vm.$data.count = 6;
// console.log(vm.count); // => 6

// vm.increment();
// console.log("count is: " + vm.count); // => 7

// console.log(vm.$data.placeholder1);
// console.log(vm.$data.placeholder2);
