/*! For license information please see zappar-aframe.js.LICENSE.txt */
!(function (e, t) {
  "object" == typeof exports && "object" == typeof module
    ? (module.exports = t(require("AFRAME")))
    : "function" == typeof define && define.amd
    ? define(["AFRAME"], t)
    : "object" == typeof exports
    ? (exports.ZapparAFrame = t(require("AFRAME")))
    : (e.ZapparAFrame = t(e.AFRAME));
})(self, function (e) {
  return (() => {
    var t = {
        6842: function (e, t, r) {
          "use strict";
          var n =
            (this && this.__awaiter) ||
            function (e, t, r, n) {
              return new (r || (r = Promise))(function (a, i) {
                function s(e) {
                  try {
                    c(n.next(e));
                  } catch (e) {
                    i(e);
                  }
                }
                function o(e) {
                  try {
                    c(n.throw(e));
                  } catch (e) {
                    i(e);
                  }
                }
                function c(e) {
                  var t;
                  e.done
                    ? a(e.value)
                    : ((t = e.value),
                      t instanceof r
                        ? t
                        : new r(function (e) {
                            e(t);
                          })).then(s, o);
                }
                c((n = n.apply(e, t || [])).next());
              });
            };
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.CameraSource = void 0);
          const a = r(5952),
            i = r(1120),
            s = r(9988),
            o = r(8491),
            c = r(4446);
          let u = 1,
            _ = new Map(),
            l = document.createElement("video");
          l.setAttribute("playsinline", ""),
            l.setAttribute("webkit-playsinline", ""),
            i.profile.videoElementInDOM &&
              ((l.style.width = "0px"),
              (l.style.height = "0px"),
              document.body.appendChild(l));
          class f extends a.HTMLElementSource {
            constructor(e, t, r) {
              super(l, t),
                (this._impl = e),
                (this._deviceId = r),
                (this._currentStream = null),
                (this._activeDeviceId = null),
                (this._hasStartedOrientation = !1),
                (this._deviceMotionListener = (e) => {
                  let t = s.Pipeline.get(this._pipeline);
                  if (!t) return;
                  let r =
                    void 0 !== e.timeStamp && null !== e.timeStamp
                      ? e.timeStamp
                      : performance.now();
                  null !== e.accelerationIncludingGravity &&
                    null !== e.accelerationIncludingGravity.x &&
                    null !== e.accelerationIncludingGravity.y &&
                    null !== e.accelerationIncludingGravity.z &&
                    t.motionAccelerometerSubmit(
                      r,
                      e.accelerationIncludingGravity.x *
                        i.profile.deviceMotionMutliplier,
                      e.accelerationIncludingGravity.y *
                        i.profile.deviceMotionMutliplier,
                      e.accelerationIncludingGravity.z *
                        i.profile.deviceMotionMutliplier
                    ),
                    null === e.rotationRate ||
                    null === e.rotationRate.alpha ||
                    null === e.rotationRate.beta ||
                    null === e.rotationRate.gamma ||
                    this._hasStartedOrientation
                      ? this._hasStartedOrientation ||
                        this._startDeviceOrientation()
                      : (e.timeStamp,
                        t.motionRotationRateSubmit(
                          r,
                          (e.rotationRate.alpha * Math.PI) / -180,
                          (e.rotationRate.beta * Math.PI) / -180,
                          (e.rotationRate.gamma * Math.PI) / -180
                        ));
                });
            }
            static create(e, t) {
              let r = u++;
              return (
                _.set(r, new f(r, e, t)),
                c.zcout("camera_source_t initialized"),
                r
              );
            }
            static get(e) {
              return _.get(e);
            }
            destroy() {
              _.delete(this._impl), super.destroy();
            }
            _stop() {
              this._currentStream &&
                (this._currentStream.getTracks().forEach((e) => e.stop()),
                (this._currentStream = null));
            }
            pause() {
              super.pause(), this._stopDeviceMotion(), this._syncCamera();
            }
            start() {
              super.start(), this._startDeviceMotion(), this._syncCamera();
            }
            _getConstraints() {
              return n(this, void 0, void 0, function* () {
                let e, t;
                this._deviceId !== f.DEFAULT_DEVICE_ID &&
                this._deviceId !== f.USER_DEFAULT_DEVICE_ID
                  ? (e = this._deviceId)
                  : (t =
                      this._deviceId === f.DEFAULT_DEVICE_ID
                        ? "environment"
                        : "user");
                let r = {
                  audio: !1,
                  video: {
                    facingMode: t,
                    width: i.profile.videoWidth,
                    height: i.profile.videoHeight,
                    frameRate: i.profile.requestHighFrameRate ? 60 : void 0,
                    deviceId: e,
                  },
                };
                if (e) return r;
                if (
                  !navigator.mediaDevices ||
                  !navigator.mediaDevices.enumerateDevices
                )
                  return r;
                let n = yield navigator.mediaDevices.enumerateDevices(),
                  a = !1;
                return (
                  (n = n.filter((e) => {
                    if ("videoinput" !== e.kind) return !1;
                    if (e.getCapabilities) {
                      a = !0;
                      let r = e.getCapabilities();
                      if (
                        r &&
                        r.facingMode &&
                        r.facingMode.indexOf(
                          "user" === t ? "user" : "environment"
                        ) < 0
                      )
                        return !1;
                    }
                    return !0;
                  })),
                  a && 0 !== n.length
                    ? ("object" == typeof r.video &&
                        (c.zcout(
                          "choosing device ID",
                          n[n.length - 1].deviceId
                        ),
                        (r.video.deviceId = n[n.length - 1].deviceId)),
                      r)
                    : r
                );
              });
            }
            getFrame(e) {
              return (
                (this._cameraToScreenRotation =
                  o.cameraRotationForScreenOrientation(!1)),
                super.getFrame(e)
              );
            }
            _getUserMedia() {
              return n(this, void 0, void 0, function* () {
                let e = yield this._getConstraints();
                return navigator.mediaDevices &&
                  navigator.mediaDevices.getUserMedia
                  ? yield navigator.mediaDevices.getUserMedia(e)
                  : yield new Promise((t, r) => {
                      navigator.getUserMedia(e, t, r);
                    });
              });
            }
            _syncCamera() {
              return n(this, void 0, void 0, function* () {
                if (this._currentStream && this._isPaused) this._stop();
                else if (
                  (this._currentStream &&
                    this._activeDeviceId !== this._deviceId &&
                    this._stop(),
                  !this._isPaused)
                ) {
                  if (
                    ((this._activeDeviceId = this._deviceId),
                    (this._currentStream = yield this._getUserMedia()),
                    this._isPaused)
                  )
                    return void (yield this._syncCamera());
                  if (((this._isUserFacing = !1), this._currentStream)) {
                    let e = this._currentStream.getVideoTracks();
                    e.length > 0 &&
                      (this._isUserFacing =
                        "user" === e[0].getSettings().facingMode);
                  }
                  if (!(this._video instanceof HTMLVideoElement)) return;
                  (this._video.src = ""),
                    (this._video.loop = !1),
                    (this._video.muted = !0),
                    (this._video.srcObject = this._currentStream),
                    this._video.play();
                }
              });
            }
            _startDeviceOrientation() {
              this._hasStartedOrientation ||
                ((this._hasStartedOrientation = !0),
                window.addEventListener("deviceorientation", (e) => {
                  let t = s.Pipeline.get(this._pipeline);
                  if (!t) return;
                  let r =
                    void 0 !== e.timeStamp && null !== e.timeStamp
                      ? e.timeStamp
                      : performance.now();
                  null !== e.alpha &&
                    null !== e.beta &&
                    null !== e.gamma &&
                    t.motionAttitudeSubmit(r, e.alpha, e.beta, e.gamma);
                }));
            }
            _startDeviceMotion() {
              window.addEventListener(
                "devicemotion",
                this._deviceMotionListener,
                !1
              );
            }
            _stopDeviceMotion() {
              window.removeEventListener(
                "devicemotion",
                this._deviceMotionListener
              );
            }
          }
          (t.CameraSource = f),
            (f.USER_DEFAULT_DEVICE_ID =
              "Simulated User Default Device ID: a908df7f-5661-4d20-b227-a1c15d2fdb4b"),
            (f.DEFAULT_DEVICE_ID =
              "Simulated Default Device ID: a908df7f-5661-4d20-b227-a1c15d2fdb4b");
        },
        8491: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.cameraRotationForScreenOrientation = t.projectionMatrix =
              void 0);
          const n = r(887);
          function a(e) {
            if (window.screen.orientation)
              switch (window.screen.orientation.type) {
                case "portrait-primary":
                  return e ? 90 : 270;
                case "landscape-secondary":
                  return 180;
                case "portrait-secondary":
                  return e ? 270 : 90;
                default:
                  return 0;
              }
            else if (void 0 !== window.orientation)
              switch (window.orientation) {
                case 0:
                  return e ? 90 : 270;
                case 90:
                  return 0;
                case 180:
                  return e ? 270 : 90;
                case -90:
                  return 180;
              }
            return 0;
          }
          (t.projectionMatrix = function (e, t, r, i = 0.01, s = 100) {
            let o = 2 * e[2],
              c = 2 * e[3],
              u = n.mat4.create();
            n.mat4.frustum(
              u,
              (i * (-0.5 - e[2])) / e[0],
              (i * (o - 0.5 - e[2])) / e[0],
              (i * (c - 0.5 - e[3])) / e[1],
              (i * (-0.5 - e[3])) / e[1],
              i,
              s
            ),
              (u[4] *= -1),
              (u[5] *= -1),
              (u[6] *= -1),
              (u[7] *= -1);
            let _ = n.mat4.create();
            n.mat4.fromScaling(_, [0.5 * o, 0.5 * c, 1]),
              n.mat4.multiply(u, _, u),
              n.mat4.fromRotation(_, (a(!1) * Math.PI) / 180, [0, 0, 1]),
              n.mat4.multiply(u, _, u);
            let l = n.vec3.create();
            (l[0] = o), (l[1] = c), (l[2] = 0), n.vec3.transformMat4(l, l, _);
            let f = Math.abs(l[0]),
              h = Math.abs(l[1]),
              d = 1;
            return (
              (d = f / t > h / r ? r / h : t / f),
              n.mat4.fromScaling(_, [d, d, 1]),
              n.mat4.multiply(u, _, u),
              n.mat4.fromScaling(_, [2 / t, 2 / r, 1]),
              n.mat4.multiply(u, _, u),
              n.mat4.fromRotation(_, (a(!1) * Math.PI) / -180, [0, 0, 1]),
              n.mat4.multiply(u, u, _),
              u
            );
          }),
            (t.cameraRotationForScreenOrientation = a);
        },
        7422: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.default = {
              incompatible: () =>
                !(
                  "function" == typeof Promise &&
                  "object" == typeof WebAssembly &&
                  navigator.mediaDevices &&
                  navigator.mediaDevices.enumerateDevices &&
                  navigator.mediaDevices.getUserMedia
                ),
              incompatible_ui: () => {
                const e = document.createElement("div");
                e.append(
                  (function () {
                    let e = document.createElement("div"),
                      t = "a recent web browser";
                    navigator.userAgent.match(/Android/i)
                      ? ((t = "Chrome for Android"),
                        (window.location.href =
                          "googlechrome://navigate?url=" +
                          encodeURI(window.location.href)),
                        setTimeout(() => {
                          window.location.href =
                            "samsunginternet://open?url=" +
                            encodeURI(window.location.href);
                        }, 2e3))
                      : navigator.userAgent.match(/iPhone|iPod|iPad/i) &&
                        ((t = "Safari"),
                        e.classList.add("zee-launcher-browser-safari")),
                      e.classList.add("zee-launcher-unsupported"),
                      (e.innerHTML = `\n            <style>.zee-launcher-unsupported {\n               display: flex;\n               flex-direction: column;\n               height: 100%;\n               justify-content: center;\n               position: absolute;\n               width: 100%;\n               height: 100%;\n               top: 0;\n               left: 0;\n               align-items: center;\n               }\n               .zee-launcher-browser-logo {\n               background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg version='1.1' viewBox='0 0 210 211' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg transform='translate(-82 -146)' fill-rule='nonzero' stroke='%23ffffff' stroke-width='2'%3E%3Cg transform='translate(83 146.5)'%3E%3Cpath d='m55.146 88.785l-32.039-49.472c19.962-24.947 49.904-38.684 80.517-38.81 17.739-0.12642 35.855 4.4246 52.336 13.99 18.2 10.619 32.039 25.874 40.846 43.404l-86.095-4.5511c-24.365-1.4327-47.556 12.347-55.565 35.439zm13.797 16.224c0 19.468 15.684 35.229 35.059 35.229 19.374 0 35.059-15.76 35.059-35.229 0-19.468-15.684-35.229-35.059-35.229-19.374 0-35.059 15.718-35.059 35.229zm132.06-37.588l-58.585 3.034c15.894 18.668 16.145 45.595 2.7678 66.243l-47.01 72.648c19.5 1.0535 39.588-3.2447 57.788-13.864 45.039-26.126 63.282-80.908 45.039-128.06zm-144.93 57.647l-39.126-77.326c-10.694 16.434-16.942 36.156-16.942 57.267 0 52.253 38.078 95.53 87.856 103.2l26.713-52.59c-24.155 4.5511-47.472-8.765-58.501-30.551z'/%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E%0A");\n               width: 211px;\n               height: 211px;\n               margin-bottom: 25%;\n               margin-top: -60px;\n               background-repeat: no-repeat;\n               }\n               .zee-launcher-browser-safari .zee-launcher-browser-logo {\n               background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg version='1.1' viewBox='0 0 211 211' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg transform='translate(-82 -146)' fill-rule='nonzero' stroke='%23fffffft' stroke-width='2'%3E%3Cpath d='m180 251.86c0-4.0385 2.9377-7.855 7.2552-7.855 3.9614 0 7.7448 2.8402 7.7448 7.145 0 4.0385-2.8487 7.855-7.1662 7.855-4.0059 0-7.8338-2.9734-7.8338-7.145zm112-0.35503c0 57.728-46.772 104.5-104.5 104.5s-104.5-46.772-104.5-104.5 46.772-104.5 104.5-104.5 104.5 46.772 104.5 104.5zm-12-1c0-51.649-41.851-93.5-93.5-93.5s-93.5 41.851-93.5 93.5 41.851 93.5 93.5 93.5 93.5-41.851 93.5-93.5zm-30.624 40.983c0 1.5095 5.4495 4.2768 6.8328 5.1154-11.486 17.401-29.26 29.938-49.423 34.928l-1.8444-7.757c-0.12576-1.0482-0.79646-1.174-1.7606-1.174-0.79646 0-1.2576 1.174-1.1737 1.7611l1.8444 7.8828c-5.5753 1.174-11.234 1.7611-16.935 1.7611-15.217 0-30.182-4.2768-43.177-12.202 0.71263-1.174 5.1141-7.5474 5.1141-8.4698 0-0.79666-0.71263-1.5095-1.5091-1.5095-1.6348 0-5.1141 6.9603-6.1621 8.344-17.522-11.615-30.182-29.602-35.044-50.148l8.0066-1.761c0.92222-0.25158 1.1737-0.92246 1.1737-1.7611 0-0.79667-1.1737-1.2579-1.8444-1.174l-7.8389 1.803c-1.048-5.3251-1.6348-10.692-1.6348-16.143 0-15.556 4.4015-30.86 12.66-43.984 1.1737 0.71281 6.749 4.5284 7.6712 4.5284 0.79646 0 1.5091-0.58702 1.5091-1.3837 0-1.6353-6.1621-4.7381-7.5455-5.7024 11.821-17.275 29.805-29.728 50.219-34.34l1.7606 7.757c0.25152 0.92246 0.92222 1.174 1.7606 1.174 0.83838 0 1.2576-1.174 1.1737-1.8449l-1.7606-7.6732c5.1141-0.92246 10.312-1.5095 15.552-1.5095 15.552 0 30.727 4.4026 43.973 12.663-0.79646 1.174-4.5273 6.6249-4.5273 7.5474 0 0.79667 0.58687 1.5095 1.3833 1.5095 1.6348 0 4.7369-6.0379 5.5753-7.4216 17.187 11.615 29.469 29.351 34.248 49.561l-6.4975 1.3837c-1.048 0.25158-1.1737 0.92246-1.1737 1.8449 0 0.79667 1.1737 1.2579 1.7606 1.174l6.6232-1.5095c1.048 5.3251 1.6348 10.776 1.6348 16.227 0 15.221-4.1919 30.189-12.073 43.062-1.1737-0.58702-6.0364-4.0672-6.9586-4.0672-0.8803 0-1.5929 0.71281-1.5929 1.5095zm-14.876-98.483c-5.2178 4.88-53.863 49.48-55.228 51.8l-38.772 64.2c5.0974-4.76 53.863-49.6 55.108-51.72l38.892-64.28z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");\n               }\n               .zee-launcher-unsupported-message {\n               text-align: center;\n               width: 250px;\n               font-family: sans-serif;\n               color: #ffffff;\n               }\n               .zee-launcher-unsupported-message-copy {\n               border: 1px solid #ffffff;\n               border-radius: 5px;\n               margin-top: 10px;\n               }\n               #zee-launcher-unsupported-message-input {\n               border: none;\n               padding: 10px;\n               border-radius: 0px;\n               border-right: 1px solid #344B60;\n               height: 40px;\n               color: #ffffff;\n               background-color: black;\n               box-sizing: border-box;\n               width: calc(100% - 65px);\n               margin-left: 5px;\n               }\n               #zee-launcher-unsupported-message-button {\n               background: none;\n               border: none;\n               outline: none;\n               text-transform: uppercase;\n               color: #ffffff;\n               height: 40px;\n               display: inline-block;\n               width: 59px;\n               }\n               .zee-launcher-unsupported-message-before-copy {\n               height: 100px;\n               display: flex;\n               flex-direction: column;\n               justify-content: center;\n               margin-top: 20px;\n               }\n               .zee-launcher-unsupported-message-copied .zee-launcher-unsupported-message-before-copy {\n               display: none;\n               }\n               .zee-launcher-unsupported-message-after-copy {\n               display: none;\n               }\n               .zee-launcher-unsupported-message-copied .zee-launcher-unsupported-message-after-copy {\n               height: 100px;\n               display: flex;\n               flex-direction: column;\n               justify-content: center;\n               margin-top: 20px;\n               }\n            </style>\n            <div class="zee-launcher-browser-logo"></div>\n            <div class="zee-launcher-unsupported-message">Open with ${t} to access this content.</div>\n            <div class="zee-launcher-unsupported-message-before-copy">\n               <div class="zee-launcher-unsupported-message ">Tap below to copy the address for easy pasting into ${t}.</div>\n               <div class="zee-launcher-unsupported-message-copy"><input id="zee-launcher-unsupported-message-input" type="text/"><button id="zee-launcher-unsupported-message-button">Copy</button></div>\n            </div>\n            <div class="zee-launcher-unsupported-message zee-launcher-unsupported-message-after-copy">COPIED! Now paste into ${t}'s address bar to experience the content.</div>\n    `);
                    let r =
                      e.querySelector(
                        "#zee-launcher-unsupported-message-input"
                      ) || document.createElement("input");
                    r.value = window.location.href;
                    let n = () => {
                      if (navigator.userAgent.match(/iPhone|iPod|iPad/i)) {
                        let e = document.createRange();
                        e.selectNodeContents(r);
                        let t = window.getSelection();
                        if (!t) return;
                        t.removeAllRanges(),
                          t.addRange(e),
                          r.setSelectionRange(0, 999999999);
                      } else r.select();
                      document.execCommand("copy"),
                        r.blur(),
                        e.classList.toggle(
                          "zee-launcher-unsupported-message-copied",
                          !0
                        );
                    };
                    return (
                      (
                        e.querySelector(
                          "#zee-launcher-unsupported-message-button"
                        ) || document.createElement("button")
                      ).addEventListener("click", n),
                      r.addEventListener("click", n),
                      e
                    );
                  })()
                ),
                  Object.assign(e.style, {
                    position: "fixed",
                    width: "100%",
                    height: "100%",
                    top: "0px",
                    left: "0px",
                    zIndex: 1001,
                    backgroundColor: "rgba(0, 0, 0, 0.9)",
                    fontFamily: "sans-serif",
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }),
                  e.classList.add("zee_launcher_compatibility"),
                  document.body.append(e);
              },
            });
        },
        1810: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.MessageDeserializer = void 0),
            (t.MessageDeserializer = class {
              constructor() {
                (this._buffer = new ArrayBuffer(0)),
                  (this._i32View = new Int32Array(this._buffer)),
                  (this._f32View = new Float32Array(this._buffer)),
                  (this._f64View = new Float64Array(this._buffer)),
                  (this._u8View = new Uint8Array(this._buffer)),
                  (this._u16View = new Uint16Array(this._buffer)),
                  (this._u32View = new Uint32Array(this._buffer)),
                  (this._offset = 0),
                  (this._length = 0),
                  (this._startOffset = -1),
                  (this._processor = {
                    int: () => this._i32View[this._startOffset++],
                    bool: () => 1 === this._i32View[this._startOffset++],
                    type: () => this._i32View[this._startOffset++],
                    float: () => this._f32View[this._startOffset++],
                    timestamp: () => {
                      this._startOffset % 2 == 1 && this._startOffset++;
                      let e = this._f64View[this._startOffset / 2];
                      return (this._startOffset += 2), e;
                    },
                    string: () => {
                      let e = this._i32View[this._startOffset++],
                        t = new TextDecoder().decode(
                          new Uint8Array(this._buffer, 4 * this._startOffset, e)
                        );
                      return (
                        (this._startOffset += e >> 2),
                        0 != (3 & e) && this._startOffset++,
                        t
                      );
                    },
                    dataWithLength: () => {
                      let e = this._i32View[this._startOffset++],
                        t = new Uint8Array(e);
                      return (
                        t.set(
                          this._u8View.subarray(
                            4 * this._startOffset,
                            4 * this._startOffset + e
                          )
                        ),
                        (this._startOffset += t.byteLength >> 2),
                        0 != (3 & t.byteLength) && this._startOffset++,
                        t.buffer
                      );
                    },
                    matrix4x4: () => {
                      let e = this._i32View[this._startOffset++],
                        t = new Float32Array(e);
                      return (
                        t.set(
                          this._f32View.subarray(
                            this._startOffset,
                            this._startOffset + 16
                          )
                        ),
                        (this._startOffset += e),
                        t
                      );
                    },
                    identityCoefficients: () => {
                      let e = this._i32View[this._startOffset++],
                        t = new Float32Array(e);
                      return (
                        t.set(
                          this._f32View.subarray(
                            this._startOffset,
                            this._startOffset + 50
                          )
                        ),
                        (this._startOffset += e),
                        t
                      );
                    },
                    expressionCoefficients: () => {
                      let e = this._i32View[this._startOffset++],
                        t = new Float32Array(e);
                      return (
                        t.set(
                          this._f32View.subarray(
                            this._startOffset,
                            this._startOffset + 29
                          )
                        ),
                        (this._startOffset += e),
                        t
                      );
                    },
                    cameraModel: () => {
                      let e = this._i32View[this._startOffset++],
                        t = new Float32Array(e);
                      return (
                        t.set(
                          this._f32View.subarray(
                            this._startOffset,
                            this._startOffset + 6
                          )
                        ),
                        (this._startOffset += e),
                        t
                      );
                    },
                    barcodeFormat: () => this._i32View[this._startOffset++],
                    faceLandmarkName: () => this._i32View[this._startOffset++],
                    instantTrackerTransformOrientation: () =>
                      this._i32View[this._startOffset++],
                    logLevel: () => this._i32View[this._startOffset++],
                  });
              }
              setData(e) {
                (this._buffer = e),
                  (this._i32View = new Int32Array(this._buffer)),
                  (this._f32View = new Float32Array(this._buffer)),
                  (this._f64View = new Float64Array(this._buffer)),
                  (this._u8View = new Uint8Array(this._buffer)),
                  (this._u16View = new Uint16Array(this._buffer)),
                  (this._u32View = new Uint32Array(this._buffer)),
                  (this._offset = 0),
                  (this._length = 0),
                  e.byteLength >= 4 &&
                    ((this._offset = 1), (this._length = this._i32View[0])),
                  (this._startOffset = -1);
              }
              hasMessage() {
                return this._offset + 1 < this._length;
              }
              forMessages(e) {
                for (; this.hasMessage(); ) {
                  let t = this._i32View[this._offset],
                    r = this._i32View[this._offset + 1];
                  (this._startOffset = this._offset + 2),
                    (this._offset += t),
                    e(r, this._processor);
                }
              }
            });
        },
        8543: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.cameraFrameTextureMatrix = t.CameraDraw = void 0);
          const n = r(9705),
            a = r(887);
          t.CameraDraw = class {
            constructor(e) {
              this._gl = e;
            }
            dispose() {
              this._vbo && this._gl.deleteBuffer(this._vbo),
                (this._vbo = void 0),
                this._shader && this._gl.deleteProgram(this._shader.prog),
                (this._shader = void 0);
            }
            _generate(e, t) {
              if (this._vbo) return this._vbo;
              if ((this._vbo || (this._vbo = e.createBuffer()), !this._vbo))
                throw new Error("Unable to create buffer object");
              let r = new Float32Array([
                -1, -1, 0, 0, 0, -1, 1, 0, 0, 1, 1, -1, 0, 1, 0, 1, -1, 0, 1, 0,
                -1, 1, 0, 0, 1, 1, 1, 0, 1, 1,
              ]);
              return (
                e.bindBuffer(e.ARRAY_BUFFER, this._vbo),
                e.bufferData(
                  e.ARRAY_BUFFER,
                  new Float32Array(r),
                  e.STATIC_DRAW
                ),
                e.bindBuffer(e.ARRAY_BUFFER, null),
                this._vbo
              );
            }
            drawCameraFrame(e, t, r, n) {
              if (!r.texture) return;
              let a = this._gl;
              a.disable(a.DEPTH_TEST),
                a.disable(a.SCISSOR_TEST),
                a.disable(a.CULL_FACE),
                a.disable(a.BLEND);
              let i = this._getCameraShader(a),
                s = this._generate(a, r);
              a.activeTexture(a.TEXTURE0),
                a.useProgram(i.prog),
                a.uniformMatrix4fv(
                  i.unif_skinTexTransform,
                  !1,
                  o(r.dataWidth, r.dataHeight, e, t, r.uvTransform, n)
                ),
                a.uniform1i(i.unif_skinSampler, 0),
                a.bindTexture(a.TEXTURE_2D, r.texture),
                a.bindBuffer(a.ARRAY_BUFFER, s),
                a.vertexAttribPointer(i.attr_position, 3, a.FLOAT, !1, 20, 0),
                a.enableVertexAttribArray(i.attr_position),
                a.vertexAttribPointer(i.attr_texCoord, 2, a.FLOAT, !1, 20, 12),
                a.enableVertexAttribArray(i.attr_texCoord),
                a.drawArrays(a.TRIANGLES, 0, 6),
                a.disableVertexAttribArray(i.attr_position),
                a.disableVertexAttribArray(i.attr_texCoord),
                a.bindTexture(a.TEXTURE_2D, null),
                a.bindBuffer(a.ARRAY_BUFFER, null),
                a.useProgram(null);
            }
            _getCameraShader(e) {
              if (this._shader) return this._shader;
              let t = e.createProgram();
              if (!t) throw new Error("Unable to create program");
              let r = n.compileShader(e, e.VERTEX_SHADER, i),
                a = n.compileShader(e, e.FRAGMENT_SHADER, s);
              e.attachShader(t, r), e.attachShader(t, a), n.linkProgram(e, t);
              let o = e.getUniformLocation(t, "skinTexTransform");
              if (!o)
                throw new Error(
                  "Unable to get uniform location skinTexTransform"
                );
              let c = e.getUniformLocation(t, "skinSampler");
              if (!c)
                throw new Error("Unable to get uniform location skinSampler");
              return (
                (this._shader = {
                  prog: t,
                  unif_skinTexTransform: o,
                  unif_skinSampler: c,
                  attr_position: e.getAttribLocation(t, "position"),
                  attr_texCoord: e.getAttribLocation(t, "texCoord"),
                }),
                this._shader
              );
            }
          };
          let i =
              "\n#ifndef GL_ES\n#define highp\n#define mediump\n#define lowp\n#endif\n\nattribute vec4 position;\nattribute vec4 texCoord;\nvarying vec4 skinTexVarying;\nuniform mat4 skinTexTransform;\n\nvoid main()\n{\n    gl_Position = position;\n    skinTexVarying = skinTexTransform * texCoord;\n}",
            s =
              "\n#define highp mediump\n#ifdef GL_ES\n    // define default precision for float, vec, mat.\n    precision highp float;\n#else\n#define highp\n#define mediump\n#define lowp\n#endif\n\nvarying vec4 skinTexVarying;\nuniform lowp sampler2D skinSampler;\n\nvoid main()\n{\n    gl_FragColor = texture2DProj(skinSampler, skinTexVarying);\n}";
          function o(e, t, r, n, i, s) {
            let o = a.mat4.create(),
              c = a.mat4.create();
            a.mat4.fromTranslation(c, [-0.5, -0.5, 0]),
              a.mat4.multiply(o, c, o),
              s &&
                (a.mat4.fromScaling(c, [-1, 1, 1]), a.mat4.multiply(o, c, o)),
              a.mat4.fromRotation(
                c,
                (-1 *
                  (function () {
                    if (window.screen.orientation)
                      switch (window.screen.orientation.type) {
                        case "portrait-primary":
                          return 270;
                        case "landscape-secondary":
                          return 180;
                        case "portrait-secondary":
                          return 90;
                        default:
                          return 0;
                      }
                    else if (void 0 !== window.orientation)
                      switch (window.orientation) {
                        case 0:
                          return 270;
                        case 90:
                          return 0;
                        case 180:
                          return 90;
                        case -90:
                          return 180;
                      }
                    return 0;
                  })() *
                  Math.PI) /
                  180,
                [0, 0, 1]
              ),
              a.mat4.multiply(o, c, o);
            let u = a.vec3.create();
            (u[0] = r), (u[1] = n), (u[2] = 0), a.vec3.transformMat4(u, u, c);
            let _ = Math.abs(u[0]),
              l = Math.abs(u[1]);
            a.mat4.fromScaling(c, [1, -1, 1]), a.mat4.multiply(o, c, o);
            let f = _ / l,
              h = e / t;
            return (
              f > h
                ? a.mat4.fromScaling(c, [1, h / f, 1])
                : a.mat4.fromScaling(c, [f / h, 1, 1]),
              a.mat4.multiply(o, c, o),
              a.mat4.fromTranslation(c, [0.5, 0.5, 0]),
              a.mat4.multiply(o, c, o),
              a.mat4.multiply(o, i, o),
              o
            );
          }
          t.cameraFrameTextureMatrix = o;
        },
        8258: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.FaceDraw = void 0);
          const n = r(9705);
          t.FaceDraw = class {
            constructor(e) {
              this._gl = e;
            }
            dispose() {
              this._vbo && this._gl.deleteBuffer(this._vbo),
                this._normalbo && this._gl.deleteBuffer(this._normalbo),
                this._ibo && this._gl.deleteBuffer(this._ibo),
                this._shader && this._gl.deleteProgram(this._shader.prog),
                (this._vbo = void 0),
                (this._normalbo = void 0),
                (this._ibo = void 0),
                (this._shader = void 0);
            }
            _generateIBO(e, t) {
              if (this._ibo && this._lastIndices === e) return this._ibo;
              if (
                ((this._lastIndices = e),
                this._ibo || (this._ibo = t.createBuffer()),
                !this._ibo)
              )
                throw new Error("Unable to create buffer object");
              return (
                t.bindBuffer(t.ELEMENT_ARRAY_BUFFER, this._ibo),
                t.bufferData(t.ELEMENT_ARRAY_BUFFER, e, t.STATIC_DRAW),
                t.bindBuffer(t.ELEMENT_ARRAY_BUFFER, null),
                this._ibo
              );
            }
            _generateVBO(e, t) {
              if ((this._vbo || (this._vbo = t.createBuffer()), !this._vbo))
                throw new Error("Unable to create buffer object");
              return (
                t.bindBuffer(t.ARRAY_BUFFER, this._vbo),
                t.bufferData(t.ARRAY_BUFFER, e, t.STREAM_DRAW),
                t.bindBuffer(t.ARRAY_BUFFER, null),
                this._vbo
              );
            }
            _generateNormalBO(e, t) {
              if (
                (this._normalbo || (this._normalbo = t.createBuffer()),
                !this._normalbo)
              )
                throw new Error("Unable to create buffer object");
              return (
                t.bindBuffer(t.ARRAY_BUFFER, this._normalbo),
                t.bufferData(t.ARRAY_BUFFER, e, t.STREAM_DRAW),
                t.bindBuffer(t.ARRAY_BUFFER, null),
                this._normalbo
              );
            }
            drawFace(e, t) {
              let r = this._gl,
                n = this._getShader(r),
                a = this._generateVBO(t.getVertices(), r),
                i = this._generateNormalBO(t.getNormals(), r),
                s = this._generateIBO(t.getIndices(), r);
              r.enable(r.DEPTH_TEST),
                r.enable(r.CULL_FACE),
                r.useProgram(n.prog),
                r.uniformMatrix4fv(n.unif_matrix, !1, e),
                r.bindBuffer(r.ARRAY_BUFFER, a),
                r.vertexAttribPointer(n.attr_position, 3, r.FLOAT, !1, 12, 0),
                r.enableVertexAttribArray(n.attr_position),
                r.bindBuffer(r.ARRAY_BUFFER, i),
                r.vertexAttribPointer(n.attr_normal, 3, r.FLOAT, !1, 12, 0),
                r.enableVertexAttribArray(n.attr_normal),
                r.bindBuffer(r.ELEMENT_ARRAY_BUFFER, s),
                r.drawElements(
                  r.TRIANGLES,
                  t.getIndices().length,
                  r.UNSIGNED_SHORT,
                  0
                ),
                r.disableVertexAttribArray(n.attr_position),
                r.disableVertexAttribArray(n.attr_normal),
                r.bindBuffer(r.ARRAY_BUFFER, null),
                r.bindBuffer(r.ELEMENT_ARRAY_BUFFER, null);
            }
            _getShader(e) {
              if (this._shader) return this._shader;
              let t = e.createProgram();
              if (!t) throw new Error("Unable to create program");
              let r = n.compileShader(e, e.VERTEX_SHADER, a),
                s = n.compileShader(e, e.FRAGMENT_SHADER, i);
              e.attachShader(t, r), e.attachShader(t, s), n.linkProgram(e, t);
              let o = e.getUniformLocation(t, "matrix");
              if (!o) throw new Error("Unable to get uniform location mattrix");
              return (
                (this._shader = {
                  prog: t,
                  unif_matrix: o,
                  attr_position: e.getAttribLocation(t, "position"),
                  attr_normal: e.getAttribLocation(t, "normal"),
                }),
                this._shader
              );
            }
          };
          let a =
              "\n#ifndef GL_ES\n#define highp\n#define mediump\n#define lowp\n#endif\n\nuniform mat4 matrix;\nattribute vec4 position;\nattribute vec3 normal;\nvarying highp vec3 vnormal;\n\nvoid main()\n{\n    gl_Position = matrix * position;\n    vnormal = normal;\n}",
            i =
              "\n#define highp mediump\n#ifdef GL_ES\n    // define default precision for float, vec, mat.\n    precision highp float;\n#else\n#define highp\n#define mediump\n#define lowp\n#endif\n\nvarying vec4 skinTexVarying;\nvarying highp vec3 vnormal;\nuniform lowp sampler2D skinSampler;\n\nvoid main()\n{\n    vec3 normal2 = 0.5 * vnormal + 0.5;\n    gl_FragColor = vec4(normal2.x , normal2.y, normal2.z, 1.0);\n}";
        },
        4203: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.FaceDrawProject = void 0);
          const n = r(9705);
          t.FaceDrawProject = class {
            constructor(e) {
              this._gl = e;
            }
            dispose() {
              this._vbo && this._gl.deleteBuffer(this._vbo),
                this._uvbo && this._gl.deleteBuffer(this._uvbo),
                this._ibo && this._gl.deleteBuffer(this._ibo),
                this._shader && this._gl.deleteProgram(this._shader.prog),
                (this._vbo = void 0),
                (this._uvbo = void 0),
                (this._ibo = void 0),
                (this._shader = void 0);
            }
            _generateIBO(e, t) {
              if (this._ibo && this._lastIndices === e) return this._ibo;
              if (
                ((this._lastIndices = e),
                this._ibo || (this._ibo = t.createBuffer()),
                !this._ibo)
              )
                throw new Error("Unable to create buffer object");
              return (
                t.bindBuffer(t.ELEMENT_ARRAY_BUFFER, this._ibo),
                t.bufferData(t.ELEMENT_ARRAY_BUFFER, e, t.STATIC_DRAW),
                t.bindBuffer(t.ELEMENT_ARRAY_BUFFER, null),
                this._ibo
              );
            }
            _generateVBO(e, t) {
              if ((this._vbo || (this._vbo = t.createBuffer()), !this._vbo))
                throw new Error("Unable to create buffer object");
              return (
                t.bindBuffer(t.ARRAY_BUFFER, this._vbo),
                t.bufferData(t.ARRAY_BUFFER, e, t.STREAM_DRAW),
                t.bindBuffer(t.ARRAY_BUFFER, null),
                this._vbo
              );
            }
            _generateUVBO(e, t) {
              if ((this._uvbo || (this._uvbo = t.createBuffer()), !this._uvbo))
                throw new Error("Unable to create buffer object");
              return (
                t.bindBuffer(t.ARRAY_BUFFER, this._uvbo),
                t.bufferData(t.ARRAY_BUFFER, e, t.STREAM_DRAW),
                t.bindBuffer(t.ARRAY_BUFFER, null),
                this._uvbo
              );
            }
            drawFace(e, t, r, n, a, i) {
              let s = this._gl,
                o = this._getShader(s),
                c = this._generateVBO(t, s),
                u = this._generateUVBO(n, s),
                _ = this._generateIBO(a, s);
              s.enable(s.DEPTH_TEST),
                s.enable(s.CULL_FACE),
                s.useProgram(o.prog),
                s.uniformMatrix4fv(o.unif_matrix, !1, e),
                s.uniformMatrix4fv(o.unif_uvmatrix, !1, r),
                s.activeTexture(s.TEXTURE0),
                s.bindTexture(s.TEXTURE_2D, i),
                s.uniform1i(o.unif_sampler, 0),
                s.bindBuffer(s.ARRAY_BUFFER, c),
                s.vertexAttribPointer(o.attr_position, 3, s.FLOAT, !1, 12, 0),
                s.enableVertexAttribArray(o.attr_position),
                s.bindBuffer(s.ARRAY_BUFFER, u),
                s.vertexAttribPointer(o.attr_uv, 3, s.FLOAT, !1, 12, 0),
                s.enableVertexAttribArray(o.attr_uv),
                s.bindBuffer(s.ELEMENT_ARRAY_BUFFER, _),
                s.drawElements(s.TRIANGLES, 6912, s.UNSIGNED_SHORT, 0),
                s.disableVertexAttribArray(o.attr_position),
                s.disableVertexAttribArray(o.attr_uv),
                s.bindBuffer(s.ARRAY_BUFFER, null),
                s.bindBuffer(s.ELEMENT_ARRAY_BUFFER, null);
            }
            _getShader(e) {
              if (this._shader) return this._shader;
              let t = e.createProgram();
              if (!t) throw new Error("Unable to create program");
              let r = n.compileShader(e, e.VERTEX_SHADER, a),
                s = n.compileShader(e, e.FRAGMENT_SHADER, i);
              e.attachShader(t, r), e.attachShader(t, s), n.linkProgram(e, t);
              let o = e.getUniformLocation(t, "matrix");
              if (!o) throw new Error("Unable to get uniform location matrix");
              let c = e.getUniformLocation(t, "uvmatrix");
              if (!c) throw new Error("Unable to get uniform location matrix");
              let u = e.getUniformLocation(t, "uSampler");
              if (!u) throw new Error("Unable to get uniform location sampler");
              return (
                (this._shader = {
                  prog: t,
                  unif_matrix: o,
                  unif_sampler: u,
                  unif_uvmatrix: c,
                  attr_position: e.getAttribLocation(t, "position"),
                  attr_uv: e.getAttribLocation(t, "uv"),
                  attr_texturecoord: e.getAttribLocation(t, "aTextureCoord"),
                }),
                this._shader
              );
            }
          };
          let a =
              "\n#ifndef GL_ES\n#define highp\n#define mediump\n#define lowp\n#endif\n\nuniform mat4 matrix;\nuniform mat4 uvmatrix;\nattribute vec4 position;\nattribute vec3 normal;\nattribute vec3 uv;\n\n// varying highp vec3 vnormal;\n\nvarying highp vec2 vTextureCoord;\nvarying highp float vAlpha;\n\nvoid main()\n{\n    gl_Position = matrix * position;\n    vec4 ret = uvmatrix * vec4(uv.x, uv.y, uv.z, 1.0);\n    ret.x /= ret.w * 2.0;\n    ret.y /= ret.w * 2.0;\n    ret.x += 0.5;\n    ret.y += 0.0;\n    vAlpha = 1.0;\n    vTextureCoord = ret.xy;\n}",
            i =
              "\n#define highp mediump\n#ifdef GL_ES\n    // define default precision for float, vec, mat.\n    precision highp float;\n#else\n#define highp\n#define mediump\n#define lowp\n#endif\n\nvarying highp vec2 vTextureCoord;\nvarying highp vec3 vnormal;\nvarying highp float vAlpha;\nuniform lowp sampler2D uSampler;\n\nvoid main()\n{\n    // vec3 normal2 = 0.5 * vnormal + 0.5;\n    vec4 p = texture2D(uSampler, vTextureCoord);\n    p.a = vAlpha;\n    gl_FragColor = p; // vec4(normal2.x , normal2.y, normal2.z, 1.0);\n}";
        },
        9359: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.drawPlane = t.disposeDrawPlane = void 0);
          const n = r(9705);
          let a,
            i,
            s,
            o = {};
          function c(e) {
            if (s) return s;
            if (((s = e.createBuffer()), !s))
              throw new Error("Unable to create buffer object");
            return (
              e.bindBuffer(e.ARRAY_BUFFER, s),
              e.bufferData(
                e.ARRAY_BUFFER,
                new Float32Array([0, 1, 0, 0, 1, 1, 1, 0]),
                e.STATIC_DRAW
              ),
              e.bindBuffer(e.ARRAY_BUFFER, null),
              s
            );
          }
          function u(e) {
            if (a) return a;
            let t = e.createProgram();
            if (!t) throw new Error("Unable to create program");
            let r = n.compileShader(
                e,
                e.VERTEX_SHADER,
                "\n#ifndef GL_ES\n#define highp\n#define mediump\n#define lowp\n#endif\n\nuniform mat4 projMatrix;\nuniform mat4 cameraMatrix;\nuniform mat4 modelViewMatrix;\nattribute vec4 position;\nattribute vec2 textureCoord;\n\nvarying highp vec2 vTextureCoord;\n\nvoid main()\n{\n    gl_Position = projMatrix * cameraMatrix * modelViewMatrix * position;\n    vTextureCoord = textureCoord;\n}"
              ),
              i = n.compileShader(
                e,
                e.FRAGMENT_SHADER,
                "\n#define highp mediump\n#ifdef GL_ES\n    // define default precision for float, vec, mat.\n    precision highp float;\n#else\n#define highp\n#define mediump\n#define lowp\n#endif\n\nvarying highp vec2 vTextureCoord;\nuniform sampler2D skinSampler;\n\nvoid main()\n{\n    gl_FragColor = texture2D(skinSampler, vTextureCoord);\n}"
              );
            e.attachShader(t, r), e.attachShader(t, i), n.linkProgram(e, t);
            let s = e.getUniformLocation(t, "projMatrix");
            if (!s)
              throw new Error("Unable to get uniform location projMatrix");
            let o = e.getUniformLocation(t, "modelViewMatrix");
            if (!o)
              throw new Error("Unable to get uniform location modelViewMatrix");
            let c = e.getUniformLocation(t, "cameraMatrix");
            if (!c)
              throw new Error("Unable to get uniform location cameraMatrix");
            let u = e.getUniformLocation(t, "skinSampler");
            if (!u)
              throw new Error("Unable to get uniform location skinSampler");
            return (
              (a = {
                prog: t,
                unif_matrix: o,
                unif_proj: s,
                unif_camera: c,
                unif_skinSampler: u,
                attr_position: e.getAttribLocation(t, "position"),
                attr_textureCoord: e.getAttribLocation(t, "textureCoord"),
              }),
              a
            );
          }
          (t.disposeDrawPlane = function () {
            (a = void 0), (i = void 0), (s = void 0), (o = {});
          }),
            (t.drawPlane = function (e, t, r, n, a) {
              let s = u(e),
                _ = (function (e) {
                  if (i) return i;
                  if (((i = e.createBuffer()), !i))
                    throw new Error("Unable to create buffer object");
                  return (
                    e.bindBuffer(e.ARRAY_BUFFER, i),
                    e.bufferData(
                      e.ARRAY_BUFFER,
                      new Float32Array([
                        -0.5, 0.125, 0, -0.5, -0.125, 0, 0.5, 0.125, 0, 0.5,
                        -0.125, 0,
                      ]),
                      e.STATIC_DRAW
                    ),
                    e.bindBuffer(e.ARRAY_BUFFER, null),
                    i
                  );
                })(e),
                l = c(e);
              e.disable(e.DEPTH_TEST),
                e.useProgram(s.prog),
                e.uniformMatrix4fv(s.unif_proj, !1, t),
                e.uniformMatrix4fv(s.unif_camera, !1, r),
                e.uniformMatrix4fv(s.unif_matrix, !1, n),
                e.bindBuffer(e.ARRAY_BUFFER, _),
                e.activeTexture(e.TEXTURE0),
                e.bindTexture(
                  e.TEXTURE_2D,
                  (function (e, t) {
                    if (o[t]) return o[t];
                    let r = e.createTexture();
                    if (!r) throw new Error("Unable to create texture");
                    (o[t] = r), e.bindTexture(e.TEXTURE_2D, r);
                    const n = e.RGBA,
                      a = e.RGBA,
                      i = e.UNSIGNED_BYTE,
                      s = new Uint8Array([0, 0, 255, 255]);
                    e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL, !0),
                      e.texImage2D(e.TEXTURE_2D, 0, n, 1, 1, 0, a, i, s);
                    const c = new Image();
                    return (
                      (c.onload = function () {
                        e.bindTexture(e.TEXTURE_2D, r),
                          e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL, !0),
                          e.texImage2D(e.TEXTURE_2D, 0, n, a, i, c),
                          e.texParameteri(
                            e.TEXTURE_2D,
                            e.TEXTURE_WRAP_S,
                            e.CLAMP_TO_EDGE
                          ),
                          e.texParameteri(
                            e.TEXTURE_2D,
                            e.TEXTURE_WRAP_T,
                            e.CLAMP_TO_EDGE
                          ),
                          e.texParameteri(
                            e.TEXTURE_2D,
                            e.TEXTURE_MIN_FILTER,
                            e.LINEAR
                          );
                      }),
                      (c.src = t),
                      r
                    );
                  })(e, a)
                ),
                e.uniform1i(s.unif_skinSampler, 0),
                e.vertexAttribPointer(s.attr_position, 3, e.FLOAT, !1, 12, 0),
                e.enableVertexAttribArray(s.attr_position),
                e.bindBuffer(e.ARRAY_BUFFER, l),
                e.vertexAttribPointer(
                  s.attr_textureCoord,
                  2,
                  e.FLOAT,
                  !1,
                  8,
                  0
                ),
                e.enableVertexAttribArray(s.attr_textureCoord),
                e.drawArrays(e.TRIANGLE_STRIP, 0, 4),
                e.disableVertexAttribArray(s.attr_position),
                e.bindBuffer(e.ARRAY_BUFFER, null);
            });
        },
        3435: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.Event5 = t.Event3 = t.Event2 = t.Event1 = t.Event = void 0),
            (t.Event = class {
              constructor() {
                this._funcs = [];
              }
              bind(e) {
                this._funcs.push(e);
              }
              unbind(e) {
                let t = this._funcs.indexOf(e);
                t > -1 && this._funcs.splice(t, 1);
              }
              emit() {
                for (var e = 0, t = this._funcs.length; e < t; e++)
                  this._funcs[e]();
              }
            }),
            (t.Event1 = class {
              constructor() {
                this._funcs = [];
              }
              bind(e) {
                this._funcs.push(e);
              }
              unbind(e) {
                let t = this._funcs.indexOf(e);
                t > -1 && this._funcs.splice(t, 1);
              }
              emit(e) {
                for (var t = 0, r = this._funcs.length; t < r; t++)
                  this._funcs[t](e);
              }
            }),
            (t.Event2 = class {
              constructor() {
                this._funcs = [];
              }
              bind(e) {
                this._funcs.push(e);
              }
              unbind(e) {
                let t = this._funcs.indexOf(e);
                t > -1 && this._funcs.splice(t, 1);
              }
              emit(e, t) {
                for (var r = 0, n = this._funcs.length; r < n; r++)
                  this._funcs[r](e, t);
              }
            }),
            (t.Event3 = class {
              constructor() {
                this._funcs = [];
              }
              bind(e) {
                this._funcs.push(e);
              }
              unbind(e) {
                let t = this._funcs.indexOf(e);
                t > -1 && this._funcs.splice(t, 1);
              }
              emit(e, t, r) {
                for (var n = 0, a = this._funcs.length; n < a; n++)
                  this._funcs[n](e, t, r);
              }
            }),
            (t.Event5 = class {
              constructor() {
                this._funcs = [];
              }
              bind(e) {
                this._funcs.push(e);
              }
              unbind(e) {
                let t = this._funcs.indexOf(e);
                t > -1 && this._funcs.splice(t, 1);
              }
              emit(e, t, r, n, a) {
                for (var i = 0, s = this._funcs.length; i < s; i++)
                  this._funcs[i](e, t, r, n, a);
              }
            });
        },
        9599: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.FaceLandmark =
              t.getFaceLandmark =
              t.destroyFaceLandmark =
              t.createFaceLandmark =
                void 0);
          const n = r(887),
            a = r(1648),
            i = r(4446);
          let s = 1,
            o = new Map();
          (t.createFaceLandmark = function (e) {
            let t = s++;
            return (
              o.set(t, new c(e)), i.zcout("face_landmark_t initialized"), t
            );
          }),
            (t.destroyFaceLandmark = function (e) {
              o.delete(e);
            }),
            (t.getFaceLandmark = function (e) {
              return o.get(e);
            });
          class c {
            constructor(e) {
              (this._name = e), (this.anchor_pose = n.mat4.create());
            }
            _getVertex(e, t, r) {
              let n = r.mean.slice();
              for (let t = 0; t < 50; t++)
                (n[0] += e[t] * r.identity[3 * t + 0]),
                  (n[1] += e[t] * r.identity[3 * t + 1]),
                  (n[2] += e[t] * r.identity[3 * t + 2]);
              for (let e = 0; e < 29; e++)
                (n[0] += t[e] * r.expression[3 * e + 0]),
                  (n[1] += t[e] * r.expression[3 * e + 1]),
                  (n[2] += t[e] * r.expression[3 * e + 2]);
              return n;
            }
            update(e, t, r) {
              let i,
                s = a.landmarkData[this._name.toString()];
              if (s) {
                if (Array.isArray(s)) {
                  i = this._getVertex(e, t, s[0]);
                  let r = this._getVertex(e, t, s[1]);
                  (i[0] = 0.5 * (i[0] + r[0])),
                    (i[1] = 0.5 * (i[1] + r[1])),
                    (i[2] = 0.5 * (i[2] + r[2]));
                } else i = this._getVertex(e, t, s);
                r && (i[0] *= -1), n.mat4.fromTranslation(this.anchor_pose, i);
              }
            }
          }
          t.FaceLandmark = c;
        },
        1648: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.landmarkData = void 0),
            (t.landmarkData = {
              0: [
                {
                  mean: [0.235, 0.2344, 0.7305],
                  identity: [
                    0.008, 0.0087, 0.0024, -0.0026, 6e-4, -0.0022, 5e-4, 0.0033,
                    0.0026, 0.0017, -0.0055, -8e-4, 0.0011, 0.0059, 0, 2e-4,
                    0.001, -0.001, -0.0044, -0.0011, -1e-4, 0.0024, 0.0019,
                    -9e-4, 4e-4, -0.0015, 0, 0.0038, 0.0013, 3e-4, 0.002,
                    -0.0021, 0.0018, 0.0023, 0.0011, 0.0012, -0.0011, -0.0017,
                    9e-4, -0.0012, -8e-4, 7e-4, -0.0017, 0.0029, -0.0029, 8e-4,
                    -0.0027, 8e-4, -0.0017, 4e-4, 9e-4, -0.001, -3e-4, 8e-4,
                    -0.0016, -3e-4, -7e-4, 0.0016, -9e-4, 0.0021, -5e-4, 0.0011,
                    -0.0024, -1e-4, 6e-4, 1e-4, -0.0026, -4e-4, -3e-4, -9e-4,
                    5e-4, 3e-4, -8e-4, -0.001, -4e-4, -8e-4, 0.0022, -0.0014,
                    -1e-4, -0.0023, 0, -0.0018, 7e-4, -0.0036, 0.0017, 0.0017,
                    -0.0018, -2e-4, -4e-4, -9e-4, -8e-4, 3e-4, 0.0012, 9e-4,
                    -4e-4, -0.0016, 5e-4, -0.0013, 0.0011, 0.0023, 0.0029,
                    0.0024, 0.0017, -0.0027, -4e-4, -0.001, -0.0018, -0.0015,
                    -0.001, 0.001, -0.0013, -1e-4, -2e-4, 7e-4, 3e-4, 3e-4,
                    -0.0016, 9e-4, -0.0021, 4e-4, 0.0014, 0.002, -7e-4, -4e-4,
                    2e-4, -4e-4, -6e-4, -9e-4, 0.0015, 4e-4, -4e-4, 5e-4,
                    -0.0015, 9e-4, 3e-4, 3e-4, -2e-4, -8e-4, -9e-4, 0.0023,
                    4e-4, 1e-4, -4e-4, -1e-4, 7e-4, 2e-4, 0.001, 1e-4, -0.0029,
                    -5e-4,
                  ],
                  expression: [
                    0, 3e-4, 0.0052, -7e-4, -0.0051, -0.0103, 0, 0.0019, 0.0027,
                    -0.0054, 0.0135, 0.035, -5e-4, -6e-4, 0.0025, -0.0045,
                    -0.0557, -0.003, -0.0191, -0.1199, 0.0548, -0.0036, -0.0682,
                    -0.0167, 2e-4, -0.0085, -0.0085, 0.0044, 0.0041, -0.0568,
                    0.0044, 0.179, 0.0065, -0.0017, -0.1006, 0.0036, -0.0267,
                    -0.3279, 0.0301, -0.0011, -0.0173, -0.001, 0.0046, 0.2808,
                    0.0207, 0.0162, 0.238, -0.0225, 0.0017, 0.1041, 0.0203,
                    5e-4, 0.0161, 0.0031, -0.0436, 0.6504, 0.0873, -0.0099,
                    0.1039, 0.0048, -0.0254, 0.2534, -0.0042, 0.003, -0.0106,
                    -0.0153, -0.0118, 0.0252, 9e-4, -0.0071, 0.0099, 0.007,
                    -0.0724, 0.0461, -0.0235, 0.0833, 0.004, 0.0141, -0.0219,
                    0.0132, -0.0042, -0.0179, 0.0045, -0.0215, 0.3638, 0.0054,
                    -0.0445,
                  ],
                },
                {
                  mean: [0.2358, 0.1466, 0.7183],
                  identity: [
                    0.0077, 0.0093, 1e-4, -0.0022, 0, -0.0041, 5e-4, 0.0022,
                    0.0028, 0.0018, -0.0038, -0.0013, 0.001, 0.0044, -2e-4, 0,
                    0.0017, -0.0016, -0.0043, -2e-4, -1e-4, 0.0023, 9e-4, 5e-4,
                    -7e-4, -4e-4, -0.0017, 0.003, 7e-4, 6e-4, 0.0011, -0.0018,
                    5e-4, 0.0018, -8e-4, 4e-4, -0.0023, -6e-4, -3e-4, -0.0015,
                    -0.0014, -1e-4, -0.0018, 0.0027, -0.0026, 3e-4, -0.0031,
                    0.0011, -0.0026, -0.0011, 0.0012, -0.0013, -2e-4, 7e-4,
                    -0.0021, 0.0021, 4e-4, 0.0012, -0.001, 0.002, -3e-4, 2e-4,
                    -0.0026, -3e-4, 0.001, 1e-4, -0.0018, -0.001, 9e-4, -0.0011,
                    0.001, 4e-4, -8e-4, -7e-4, -0.001, -3e-4, 7e-4, -5e-4,
                    -6e-4, -0.0019, -5e-4, -0.002, 7e-4, -0.0027, 0.0014,
                    0.0013, 6e-4, -5e-4, -3e-4, -3e-4, -0.001, 0, 0.0019, 1e-4,
                    6e-4, -0.0012, 4e-4, -9e-4, 4e-4, 0.0025, 3e-4, 0.0024,
                    0.0017, -9e-4, -0.0015, -0.0015, -0.001, -0.0023, -0.001,
                    -5e-4, -4e-4, 8e-4, 9e-4, 7e-4, 2e-4, 7e-4, -9e-4, 9e-4,
                    -0.0013, 1e-4, 9e-4, 2e-4, 6e-4, -6e-4, -8e-4, -4e-4, -7e-4,
                    8e-4, 0.0019, 3e-4, 0.0015, 2e-4, -0.0015, -3e-4, 0, 6e-4,
                    3e-4, 6e-4, -6e-4, 2e-4, 5e-4, -4e-4, 0.0012, -4e-4, 2e-4,
                    -8e-4, 6e-4, -4e-4, 2e-4, -0.0021,
                  ],
                  expression: [
                    -0.0034, 0.0054, 0.0069, 0.004, 6e-4, -0.0104, -3e-4,
                    0.0036, 0.0025, 0.0065, 0.0296, 0.0208, -9e-4, 0.0154,
                    0.0029, -0.0167, 0.0124, 0.004, -0.0102, 0.0351, 0.028,
                    -0.019, 0.0146, -0.0035, -0.0023, -0.0069, -0.0051, -0.01,
                    0.0262, -0.028, 0.0112, 0.082, 0.023, -0.0019, -0.066,
                    -0.0104, -0.0408, 0.0164, 0.0075, -0.0074, 0.0367, 0.0041,
                    0.0517, -0.0207, 0.0045, 0.0291, -0.0672, -0.0129, 0.0345,
                    -0.1558, -0.0106, 0.0037, -0.0437, -0.0021, 0.0854, -0.1121,
                    0.0187, 0.0041, 0.0072, 0.0011, 0.0193, -0.0143, -0.0119,
                    0.005, -0.02, -0.0122, -0.008, 0.0527, 0.0036, -0.006,
                    0.0222, 0.007, -0.0429, 0.046, -0.0046, 0.0226, -0.0059,
                    0.0202, -0.0173, 0.0087, 0, -0.0067, -0.0095, -0.0153,
                    0.1506, -0.0017, 0.0021,
                  ],
                },
              ],
              1: [
                {
                  mean: [-0.2271, 0.2323, 0.7319],
                  identity: [
                    -0.0084, 0.0097, 0.0018, 0.0041, 2e-4, -0.002, -0.0012,
                    0.0036, 0.0019, -9e-4, -0.0063, -0.001, -3e-4, 0.0053, 6e-4,
                    1e-4, 5e-4, -0.0015, 0.0044, -0.0025, -0.0015, -0.002,
                    0.0016, -6e-4, 2e-4, -0.0013, 0, -0.0022, 2e-4, 2e-4,
                    -0.0025, -0.0014, 0.0015, 8e-4, 2e-4, 0.0012, 6e-4, -6e-4,
                    0.0017, 0, 3e-4, -1e-4, 0.0024, 0.0025, -0.0029, -0.0015,
                    -0.0015, 1e-4, 0.0031, -0.0016, 7e-4, 0.0019, 6e-4, 0.002,
                    9e-4, 0.001, -0.0014, -0.002, -0.0015, 0.0029, 1e-4, 5e-4,
                    -0.0023, 8e-4, -0.0011, 0.0019, 0.0017, -3e-4, -0.0011,
                    -3e-4, 0.0011, -8e-4, 0.0019, -0.0022, 1e-4, 0.0015, 0.0017,
                    -8e-4, -0.0011, -0.0022, 3e-4, 0.0022, 6e-4, -0.003, -2e-4,
                    0, -0.0017, -2e-4, 0, 1e-4, 4e-4, 0.0012, 0.0019, -0.0014,
                    4e-4, -0.0017, -0.0012, -0.0011, 0.0021, -0.0029, 0.0026,
                    0.0018, -0.0023, -0.0029, 1e-4, 0.0014, -0.0019, -4e-4,
                    -4e-4, 0.0023, -0.0016, 0, -9e-4, 0.0014, -0.0015, 0.0015,
                    -0.0016, -0.0011, -0.0022, 1e-4, -0.0018, 0.0027, -0.0013,
                    4e-4, -1e-4, -5e-4, 0.0011, -2e-4, 0.0015, 5e-4, -9e-4,
                    -1e-4, 0.0029, 6e-4, 0, -3e-4, 7e-4, -8e-4, -5e-4, 0.0025,
                    3e-4, 2e-4, -8e-4, -1e-4, 3e-4, 0, 0.0014, 2e-4, -0.0024,
                    1e-4,
                  ],
                  expression: [
                    -0.0025, -9e-4, 0.006, 0.004, -0.0027, -0.0113, -8e-4,
                    0.001, 0.0031, -0.0016, 0.0144, 0.0382, -3e-4, -5e-4,
                    0.0035, -0.0044, -0.0511, -0.0014, -7e-4, -0.1007, 0.0582,
                    -6e-4, -0.0606, -0.0165, 5e-4, -0.0087, -0.0093, 0.0036,
                    0.0057, -0.0576, -0.0039, 0.1488, 0.0127, 0.0016, -0.0666,
                    -9e-4, -0.0153, 0.3162, -0.0445, -0.0021, 0.0023, 0.0043,
                    -0.0033, 0.2382, 0.0063, -0.0217, 0.167, -0.039, 0.0097,
                    -0.1144, -0.0189, -0.0145, 0.6831, 0.0632, -0.0012, -0.1959,
                    -0.0133, 4e-4, 0.1108, -3e-4, 0.0062, 0.2593, -0.0161,
                    -0.0018, -0.0051, -0.012, 0.0162, 0.016, -0.0022, -0.0052,
                    -0.0201, 0.0101, 0.0115, 0.0365, -0.024, -0.0059, 0.0188,
                    -0.0336, 0.0352, 0.0224, -0.0229, 0.0146, 0.0086, -0.0273,
                    -0.0032, 0.0103, -0.0112,
                  ],
                },
                {
                  mean: [-0.2288, 0.1541, 0.7202],
                  identity: [
                    -0.0082, 0.0101, 2e-4, 0.0036, -7e-4, -0.0037, -8e-4,
                    0.0024, 0.0022, -0.0013, -0.0045, -0.0013, -6e-4, 0.0045,
                    -4e-4, 4e-4, 0.0012, -0.0014, 0.0042, -0.001, -7e-4,
                    -0.0019, 3e-4, -2e-4, 0.0012, -4e-4, -0.0012, -0.0018,
                    -4e-4, -1e-4, -0.0014, -0.0012, 1e-4, 1e-4, -0.0017, 0.001,
                    0.0015, -1e-4, 6e-4, 1e-4, 0, -6e-4, 0.0028, 0.0021,
                    -0.0025, -0.002, -0.0015, 7e-4, 0.0028, -0.0023, 9e-4,
                    0.0013, 1e-4, 0.0016, 0.0012, 0.0032, -6e-4, -0.0013,
                    -0.0011, 0.0021, 3e-4, -5e-4, -0.0024, 4e-4, -4e-4, 0.0014,
                    0.0015, -8e-4, -3e-4, 3e-4, 0.0017, -6e-4, 0.002, -0.0018,
                    -3e-4, 9e-4, 1e-4, 2e-4, -6e-4, -0.0015, -4e-4, 0.0022,
                    7e-4, -0.0023, 0, -2e-4, -2e-4, -3e-4, -1e-4, 6e-4, -2e-4,
                    6e-4, 0.0022, -3e-4, 0.0013, -0.0014, -5e-4, -3e-4, 0.0013,
                    -0.0027, 6e-4, 0.0025, -0.0023, -8e-4, -0.0013, 0.0017,
                    -9e-4, -0.0019, 1e-4, 8e-4, -7e-4, -4e-4, 0, 0.001, -0.001,
                    0.0019, -8e-4, -0.0015, -6e-4, -2e-4, -0.0011, 8e-4, 1e-4,
                    9e-4, -8e-4, -4e-4, 6e-4, 7e-4, 0.0021, -4e-4, 7e-4, -5e-4,
                    0.0021, -7e-4, -4e-4, -9e-4, 8e-4, 3e-4, 1e-4, 3e-4, 1e-4,
                    9e-4, 0.001, -5e-4, 5e-4, -0.001, 0.001, 4e-4, -5e-4,
                    -0.0012,
                  ],
                  expression: [
                    8e-4, 0.0037, 0.0078, -4e-4, 5e-4, -0.012, -2e-4, -0.0046,
                    0.0033, -0.0089, 0.0295, 0.0221, -0.0024, -0.0084, 0.0013,
                    0.0057, 0.0125, 0.0049, -0.0036, 0.0373, 0.0285, 0.0115,
                    0.0135, -0.0035, 0.0048, 0.0108, -0.0033, 0.0106, 0.0281,
                    -0.0301, -0.0082, 0.0803, 0.0244, -7e-4, -0.0725, -0.0105,
                    -0.0247, -0.0036, -0.0143, -0.0045, -0.029, 2e-4, -0.0303,
                    0.0093, -0.0021, -0.0196, -0.0754, -0.0211, 0.0326, 0.1246,
                    0.006, -0.0804, -0.1499, 0.0109, 0.0182, -0.0029, -0.0014,
                    -0.0035, 0.0072, -8e-4, -0.0152, -0.0108, -0.0166, -0.0073,
                    -0.0144, -0.0095, 0.0101, 0.047, -0.0018, -0.004, -0.0189,
                    0.0027, 0.0104, 0.0298, -0.0042, -0.0096, 0.0191, -0.0217,
                    0.0228, 0.0226, -0.0105, 0.0047, -0.0048, -0.0172, 0.0061,
                    -0.0043, -0.0016,
                  ],
                },
              ],
              2: {
                mean: [0.5396, 0.2028, 0.2496],
                identity: [
                  0.0204, 0.0146, -0.0182, -0.0052, 0.0158, -0.0038, -0.0025,
                  -0.0108, -0.006, 0.0085, -0.0044, 0.0029, 0.0042, 0.001,
                  0.0095, 0.0015, -0.0034, -0.0064, -0.0057, 7e-4, 0.0026, 7e-4,
                  0.0037, -6e-4, 0.0037, 0.0026, 0.0024, 5e-4, -0.0019, -0.0013,
                  0.003, -0.0028, 0.0018, -9e-4, 0.002, -0.0047, 0.004, -0.003,
                  0.0031, -0.0027, -0.0026, -0.0017, 0.0016, 0.0014, -4e-4,
                  0.0021, -0.002, 0, 0.0017, 7e-4, -4e-4, -7e-4, -0.0018, -9e-4,
                  2e-4, -0.0012, 1e-4, -5e-4, -0.0011, 4e-4, 2e-4, 0.0011, 1e-4,
                  8e-4, 0.0017, -0.0013, 0.0025, 0.0017, 0.001, 2e-4, 3e-4,
                  5e-4, -4e-4, -1e-4, -5e-4, 7e-4, -0.0022, -0.0029, 6e-4,
                  -8e-4, -6e-4, 6e-4, -5e-4, 5e-4, 0.0013, 3e-4, -5e-4, -0.003,
                  7e-4, 2e-4, 0.0016, -4e-4, 0, 0, 4e-4, 1e-4, 0.0014, 0.0012,
                  1e-4, 4e-4, -1e-4, 8e-4, 9e-4, 4e-4, -4e-4, 9e-4, -2e-4,
                  0.001, 9e-4, 4e-4, 1e-4, 7e-4, 7e-4, 0.001, -0.0017, -8e-4,
                  2e-4, 0.0017, -3e-4, -1e-4, 4e-4, 5e-4, 7e-4, 5e-4, -1e-4,
                  -6e-4, -1e-4, 1e-4, -3e-4, -7e-4, -2e-4, -5e-4, 0, -3e-4,
                  3e-4, 8e-4, -2e-4, -3e-4, 5e-4, 1e-4, -7e-4, -0.001, -2e-4,
                  3e-4, 4e-4, -1e-4, 7e-4, 0, 4e-4, 4e-4,
                ],
                expression: [
                  1e-4, -4e-4, 1e-4, 0, 5e-4, 2e-4, 0, 0, 3e-4, -2e-4, 3e-4,
                  5e-4, -1e-4, 2e-4, 8e-4, 1e-4, -2e-4, -5e-4, -3e-4, 6e-4,
                  5e-4, 0, 1e-4, 2e-4, 1e-4, -1e-4, -6e-4, -2e-4, 5e-4, 0,
                  -4e-4, 4e-4, 0.0016, 4e-4, -4e-4, -0.0015, 0, 1e-4, 1e-4,
                  -3e-4, 3e-4, 0.0019, -2e-4, 7e-4, 4e-4, 4e-4, -8e-4, -0.0015,
                  0.0013, -0.0016, -0.0069, 4e-4, -6e-4, -0.0019, 0, -1e-4,
                  5e-4, -3e-4, 2e-4, 0.0014, -3e-4, 6e-4, 0.0011, 4e-4, -3e-4,
                  -0.0032, -6e-4, 8e-4, 0.0025, -3e-4, 3e-4, 0.0015, -1e-4,
                  1e-4, 3e-4, -1e-4, 0, 0, -3e-4, 4e-4, 0.0019, 1e-4, 0, -8e-4,
                  -1e-4, 1e-4, 5e-4,
                ],
              },
              3: {
                mean: [-0.5464, 0.2141, 0.26],
                identity: [
                  -0.0207, 0.0172, -0.0176, 0.0068, 0.0148, -0.0051, 0.0042,
                  -0.0101, -0.0058, -0.0087, -0.0059, 0.0045, -0.0056, 0.0017,
                  0.0097, -0.0048, -0.004, -0.0044, 0.0019, 2e-4, 0.0041,
                  -0.0052, 0.0041, 2e-4, -0.0027, 6e-4, 0.002, -0.0027, -0.0033,
                  -6e-4, -0.004, 9e-4, -0.0012, -1e-4, -0.0026, 0.0021, -0.003,
                  -0.0025, 0.0052, 0.0025, 0.0022, -1e-4, -8e-4, 0.0013, 0.001,
                  4e-4, 0.0018, 0.0014, 6e-4, -5e-4, -0.0015, -0.0039, 0.0014,
                  -1e-4, 8e-4, -2e-4, 6e-4, -5e-4, -0.0038, -0.0012, -0.0018,
                  -3e-4, 0.001, 9e-4, 0.0012, 0.0024, -0.0024, -7e-4, -0.0016,
                  -0.0016, 3e-4, -0.001, -0.0014, -0.0014, 0.001, -3e-4, -7e-4,
                  -0.0012, 3e-4, 6e-4, 3e-4, -5e-4, 3e-4, 0.0012, 6e-4, -8e-4,
                  4e-4, 4e-4, 8e-4, -2e-4, -0.0014, 3e-4, 0, 0.0023, -3e-4,
                  -0.0012, -0.0013, 0.0011, -2e-4, -0.0014, -1e-4, 0.0014, 0,
                  3e-4, 3e-4, -8e-4, -5e-4, -7e-4, -7e-4, -2e-4, 3e-4, 5e-4,
                  2e-4, -1e-4, 0.0011, -0.0014, 1e-4, -0.0015, -1e-4, -3e-4, 0,
                  -0.001, -1e-4, -8e-4, 8e-4, -8e-4, -2e-4, -0.0011, -3e-4,
                  -4e-4, 1e-4, -2e-4, 3e-4, -7e-4, 0, 3e-4, 1e-4, -8e-4, 5e-4,
                  1e-4, 4e-4, 0.0014, -6e-4, -0.001, -3e-4, -2e-4, 1e-4, -1e-4,
                  -1e-4, 7e-4,
                ],
                expression: [
                  -3e-4, -1e-4, 6e-4, 4e-4, 0, -7e-4, 0, -3e-4, -2e-4, -4e-4,
                  0.0012, 8e-4, 1e-4, -5e-4, -7e-4, -4e-4, 0, 1e-4, -4e-4,
                  0.0017, 7e-4, 0, 1e-4, 3e-4, 0, 4e-4, 4e-4, 5e-4, 1e-4,
                  -0.001, -7e-4, 0.0022, 0.0026, 5e-4, -0.0024, -0.0023, 0,
                  1e-4, 3e-4, 0, -0.0013, -0.0015, 6e-4, 0.0014, 8e-4, -2e-4,
                  -0.0025, -0.0023, -3e-4, 0.0049, 0.006, -2e-4, -7e-4, -2e-4,
                  0, -0.0019, -0.0018, -2e-4, 0.0017, 0.0017, 3e-4, 0.0015,
                  7e-4, 1e-4, -0.0023, -0.0036, 2e-4, 0.0023, 0.0017, 0, -5e-4,
                  -3e-4, -3e-4, 4e-4, 2e-4, -1e-4, -3e-4, -5e-4, 1e-4, 0.0018,
                  0.0025, 1e-4, -6e-4, -0.0011, 0, 1e-4, 1e-4,
                ],
              },
              4: {
                mean: [0.0018, 0.1864, 0.853],
                identity: [
                  -0.0011, 0.0134, 0.0085, 9e-4, -0.0025, -7e-4, -3e-4, 0.0033,
                  4e-4, -5e-4, -0.0047, -0.002, 7e-4, 0.0026, -0.0069, -1e-4,
                  0.0036, 0.0072, 5e-4, -8e-4, -0.0047, 4e-4, -8e-4, -0.001, 0,
                  2e-4, -0.0036, -2e-4, -0.001, -0.0048, -1e-4, 0.0018, 0.0044,
                  -7e-4, -2e-4, 0.0043, 3e-4, 0.002, -0.0031, 0, -7e-4, 0.0013,
                  0, 0.0037, 0.0033, -0.0016, -0.0012, 0.002, -1e-4, -0.0027,
                  0.0051, 5e-4, 8e-4, 7e-4, -0.0017, 0.0054, 0.0023, -3e-4,
                  0.0032, 1e-4, 0, 7e-4, -5e-4, -0.0011, 2e-4, 8e-4, 0, -0.0033,
                  -8e-4, -7e-4, 7e-4, 0.0033, 5e-4, -3e-4, 0.0029, -1e-4,
                  -0.0024, -0.0011, -0.002, -0.0015, -0.0019, 2e-4, 7e-4,
                  0.0031, 6e-4, 0.0012, 0, 0, -0.0021, 0, -9e-4, -0.0011,
                  -0.0011, -2e-4, 0.0015, 0.001, 0.0013, 8e-4, 0.001, -3e-4,
                  9e-4, 0.0027, -2e-4, -0.0011, -0.0011, 6e-4, 7e-4, 2e-4, 1e-4,
                  -5e-4, -0.0022, 0.0011, -0.0014, 9e-4, 3e-4, 2e-4, 0, -6e-4,
                  -4e-4, -0.0011, -7e-4, 0.001, -0.0012, 6e-4, -0.0012, -0.0015,
                  3e-4, -9e-4, -0.0013, -0.0013, 7e-4, 0.001, -0.0011, -0.0013,
                  0.0015, 4e-4, 1e-4, 4e-4, -1e-4, -0.0016, -0.0016, 9e-4,
                  -7e-4, -0.0024, 5e-4, -1e-4, -0.0017, -2e-4, 3e-4, -9e-4,
                ],
                expression: [
                  -0.0017, 0.0019, 0.0097, 0.003, -0.0103, -0.0093, 9e-4, 6e-4,
                  0.0023, -0.0017, -0.0204, 0.0376, 0.0033, -0.0034, 0.0033,
                  -0.0026, -0.0322, 0.0396, -0.0032, -0.0947, 0.0942, -7e-4,
                  -0.0175, 0.0266, -0.001, -6e-4, 0.0016, 0.0025, 0.0157,
                  -0.0142, -0.0022, 0.037, 0.015, 0.0021, -0.0102, -0.0107,
                  0.0036, 0.0055, -0.0051, 0.0021, 3e-4, -3e-4, 4e-4, -0.0177,
                  0.0074, -6e-4, -0.0357, 0.0149, -0.0066, 9e-4, 0.0013,
                  -0.0031, 0.0016, 0.0095, 0.002, 0.0052, 0.0035, -3e-4, 0.0053,
                  -0.0082, 0.002, 0.0022, -0.0071, -0.0011, 5e-4, 0.0055,
                  0.0011, 3e-4, -0.0126, -4e-4, 3e-4, -0.0023, -0.0015, 0.0059,
                  0.0063, -0.0042, -0.0023, 0.0055, 0.0019, 0.0017, -0.0075,
                  6e-4, -8e-4, 0.0018, 0.0012, 0.0012, -5e-4,
                ],
              },
              5: {
                mean: [-0.002, -0.0469, 1.0039],
                identity: [
                  -0.0017, 0.0018, 0.0156, 6e-4, -0.0038, 5e-4, 4e-4, 0.0013,
                  0.002, -4e-4, -0.0015, -0.0051, 5e-4, -7e-4, -0.0055, -1e-4,
                  -9e-4, 0.008, -2e-4, 0.0036, -0.0053, 4e-4, -0.0026, -0.0016,
                  7e-4, 9e-4, -0.009, -3e-4, 7e-4, -0.0084, 0.0015, 0.0021,
                  0.0032, -0.0015, 0.0018, 0.0046, -3e-4, -4e-4, -1e-4, 8e-4,
                  -0.0044, -7e-4, -8e-4, 7e-4, 0.0048, -0.0024, -3e-4, 0.0024,
                  2e-4, -0.0051, 0.0058, -6e-4, 0.0028, 0.0018, -0.0021, 0.0035,
                  0.0057, 0.0011, 0.0065, 0, -2e-4, 0.0011, 0.003, -0.0027,
                  8e-4, 7e-4, 3e-4, -0.0039, -0.002, -2e-4, -0.0015, 0.0034,
                  0.0012, -0.0025, 0.0024, -2e-4, 4e-4, -0.0042, -0.0024,
                  -0.001, -0.0023, 0.0016, -7e-4, 0.0039, 1e-4, -5e-4, 0.0018,
                  3e-4, -2e-4, -9e-4, -0.0015, 3e-4, -7e-4, -1e-4, -2e-4,
                  0.0023, 0.0032, 0.002, -0.0013, 0.0013, -0.0038, 0.0045, 1e-4,
                  -0.0031, 1e-4, 0.0019, -1e-4, 0.0016, 0.0013, 0, -0.002,
                  0.0023, 2e-4, 0.0011, 0.0018, -0.0024, 6e-4, -0.0017, 0.002,
                  -8e-4, -0.0021, 7e-4, 0.0011, 8e-4, 4e-4, -0.001, 0.0012,
                  2e-4, -6e-4, -0.0027, -5e-4, 0.001, -9e-4, 1e-4, -1e-4, 8e-4,
                  -0.0011, 0.0022, -0.001, -5e-4, -0.0011, 0.0016, -0.0015,
                  8e-4, -3e-4, 9e-4, 0.0013, -7e-4, -7e-4, -2e-4,
                ],
                expression: [
                  -0.0018, -0.0168, 0.0088, 0.0389, 0.1026, 0.0414, 0.2201,
                  -0.0262, -0.0016, -0.0017, 0.0612, -0.0298, -0.0323, 0.0093,
                  0.0013, -0.005, 0.2207, 0.1315, -4e-4, 0.0858, -0.0303,
                  -0.0133, 0.015, -0.008, 0.1454, 0.0114, 0.0177, -0.0077,
                  0.1022, 0.0356, -0.0023, 0.1088, 0.0232, 0.003, -0.0706,
                  0.0347, -1e-4, 0.004, -0.0011, 0.0397, -0.0096, -0.0033,
                  0.0029, -0.01, -0.0083, -6e-4, -0.0135, 0.0016, -0.0087,
                  -0.0019, 0.0022, -0.004, -0.0087, 0.0105, 8e-4, -0.005,
                  0.0069, 0.0028, 0.0409, -0.0391, 0.003, 0.0103, 0.0051,
                  0.0026, 0.0776, -0.0083, -0.0062, -0.0567, 0.0268, 0.0175,
                  0.0017, 0.0156, -0.0043, 0.0299, -0.0395, -0.0015, 0.0051,
                  -0.0148, 0.0125, 0.0035, 0.0603, 0.0109, -0.0645, -0.0257,
                  0.002, 6e-4, -8e-4,
                ],
              },
              6: {
                mean: [-6e-4, -0.1542, 0.8789],
                identity: [
                  -7e-4, -0.0032, 0.01, 0, -0.0027, 0.0031, 6e-4, 5e-4, -6e-4,
                  -3e-4, 0.0013, -0.0049, -2e-4, -0.002, -0.0046, 8e-4, -0.0011,
                  0.0054, 2e-4, 0.0043, -0.0027, 3e-4, -0.0022, -0.0019, 8e-4,
                  0.0032, -0.0069, 0, 4e-4, -0.0071, 0.0016, 0.0027, 0.0039,
                  -0.0017, 9e-4, 0.0031, -1e-4, -5e-4, -4e-4, 7e-4, -0.0026,
                  -0.0012, -5e-4, 6e-4, 2e-4, -0.0014, -0.0013, 0.0019, -2e-4,
                  -0.0053, 0.0031, -6e-4, 0.0016, 0.0023, -0.0013, 0.0021,
                  0.0029, 8e-4, 0.0052, 0, 4e-4, 0, 0.0037, -0.0026, 3e-4,
                  0.002, -2e-4, -0.0024, 4e-4, -4e-4, -0.0012, 8e-4, 7e-4,
                  -0.0023, 5e-4, 0, 0.0014, -0.0022, -0.0016, 0, -0.0012, 8e-4,
                  -7e-4, 0.0014, -6e-4, -0.0012, -3e-4, 2e-4, 0.0012, -3e-4,
                  -0.002, -1e-4, 1e-4, -2e-4, -0.0016, 9e-4, 0.002, 0.0019, 0,
                  6e-4, -0.0022, 0.0016, 1e-4, -0.0017, -0.0013, 0.001, 9e-4,
                  -1e-4, 0.0011, 3e-4, -7e-4, 0.0014, 8e-4, 0.0013, 0.0011,
                  -0.002, 0, -0.0015, 0.0014, 0.001, -0.0015, 7e-4, 3e-4, 0.001,
                  -1e-4, 0.0012, 7e-4, 6e-4, -4e-4, -0.0013, -0.0012, -9e-4,
                  -0.0011, 2e-4, -5e-4, 5e-4, 4e-4, 2e-4, 1e-4, 0, 5e-4, 5e-4,
                  -0.0014, 0.0015, -9e-4, 5e-4, 0.0014, -8e-4, -8e-4, 0.0012,
                ],
                expression: [
                  8e-4, 0.0481, 0.1653, 0.0784, 0.1008, -0.3992, 0.5088, -0.02,
                  0.0542, 0.001, 0.3723, -0.0151, -0.0986, 0.0283, -0.0033,
                  -0.0121, 0.2634, 0.1202, 0.0036, -0.0529, -0.0245, -0.0297,
                  -0.1085, 0.0495, 0.3264, 0.0083, 4e-4, -0.0314, 0.1459,
                  -0.1142, -0.003, 1e-4, 0.1154, -0.0035, -0.0285, -0.0184,
                  -1e-4, 0.0012, 0.0035, 0.079, -0.0103, 0.0043, 0.011, -0.004,
                  -0.0774, -0.0047, -0.023, 0.0284, -0.0048, -0.001, 0.0149,
                  -0.0039, 0.0046, 0.0528, -6e-4, 0.0063, 0.0376, 0.0096,
                  0.0558, -0.0295, 0, -0.0311, -0.0634, 0.0062, 0.0176, -0.0154,
                  -0.0109, -0.1149, 0.0192, 0.0326, 0.0121, 0.0237, 0.0034,
                  0.0262, -0.0778, 0.0014, -0.0045, -0.0203, 0.0077, 0.0588,
                  0.0575, 0.008, -0.0557, -0.0095, 0.0032, 0.0054, -0.0042,
                ],
              },
              7: {
                mean: [0.0038, -0.2927, 0.833],
                identity: [
                  6e-4, -0.0109, 0.0073, -6e-4, -0.0044, 0.0017, -1e-4, -0.0022,
                  -6e-4, -3e-4, 0.0065, -0.0014, -6e-4, -0.0051, -0.0046, 3e-4,
                  -0.0029, 0.003, 2e-4, 0.0038, -6e-4, 0, -0.0012, 6e-4, -4e-4,
                  0.0053, -0.0075, -2e-4, -7e-4, -0.0063, 0.0014, 0.0026,
                  0.0019, -0.0022, 0.0018, 0.0028, -1e-4, -0.0012, 0.0011, 9e-4,
                  0.0019, -0.0019, -1e-4, 0.0012, -0.0022, -3e-4, -0.0012, 4e-4,
                  -8e-4, 3e-4, -3e-4, 0, 0.0017, 0.0021, -4e-4, 0.0012, 0.0022,
                  -3e-4, 0.0026, -3e-4, 4e-4, -0.0026, 0.0032, -0.0019, 3e-4,
                  0.0015, 1e-4, -0.0015, 0.0013, -1e-4, 1e-4, -0.0029, 0, -2e-4,
                  -0.0028, -7e-4, 0.0019, -3e-4, -2e-4, 0.0012, 9e-4, 4e-4,
                  -0.001, -0.002, -0.0016, 0.0011, -1e-4, 3e-4, 0.0021, 2e-4,
                  -0.0014, -9e-4, -1e-4, 0, -2e-4, -0.001, 0.0015, 0.0018, 1e-4,
                  7e-4, 8e-4, 0.0017, 0.001, -9e-4, 1e-4, 4e-4, 0.0023, -1e-4,
                  0.0012, 1e-4, -8e-4, 2e-4, 0.0018, 6e-4, 3e-4, 1e-4, 0.0012,
                  -3e-4, 0.002, -6e-4, 0, -1e-4, -0.0022, 4e-4, 5e-4, 0.0011,
                  2e-4, -0.0013, -0.0023, 6e-4, 6e-4, -5e-4, -5e-4, 9e-4, 2e-4,
                  2e-4, 0.0011, -3e-4, 0.0011, 0.0015, 0.0011, 3e-4, 2e-4, 8e-4,
                  -4e-4, -8e-4, 3e-4, 0, 0.0012, -1e-4,
                ],
                expression: [
                  0.026, 0.1107, 0.3257, 0.1917, 0.3206, -1.1348, 1.0791,
                  -0.035, 0.1549, -0.0103, 0.6953, 1e-4, -0.3262, 0.068, 0.0219,
                  -0.0044, 0.3643, 0.2178, 0.0168, -0.2478, -0.1321, -0.0414,
                  -0.3782, -0.0617, 0.5088, -0.0031, -0.0311, -0.0497, 0.0948,
                  -0.385, 0.0148, -0.2224, -0.1415, -0.0074, 0.0863, -0.203,
                  3e-4, -0.0081, 0.0057, 0.1164, -0.0039, 0.0015, -0.0024,
                  0.0505, 0.1532, 0.0039, -0.0148, -0.0753, 0.0163, 0.0058,
                  -0.0339, 0.0036, 0.0252, -0.0569, -0.0041, 0.0163, -0.0361,
                  0.0035, -0.018, 0.1266, 0, -0.0163, -0.0046, 0.0133, -0.1656,
                  0.2134, 0.0191, 0.0057, 0.0734, 0.0681, 0.0039, -0.0144,
                  0.029, -0.074, -0.046, 0.0122, 0.0072, -0.0162, -0.0349,
                  -0.1234, 0.0212, -0.0355, 0.0535, 0.1218, 0.0043, -0.024,
                  0.0016,
                ],
              },
              8: {
                mean: [-0.0018, -0.3037, 0.8491],
                identity: [
                  2e-4, -0.0112, 0.0077, -4e-4, -0.0044, 0.0024, 1e-4, -0.0021,
                  -4e-4, -4e-4, 0.0066, -0.002, -4e-4, -0.0052, -0.0044, 3e-4,
                  -0.0032, 0.0039, 4e-4, 0.0042, -3e-4, 2e-4, -0.0012, -2e-4,
                  -2e-4, 0.0052, -0.0083, -1e-4, -8e-4, -0.0056, 0.0017, 0.0024,
                  0.0019, -0.0023, 0.002, 0.0027, -2e-4, -0.0013, 0.002, 9e-4,
                  0.0017, -0.0028, -2e-4, 0.0012, -0.0026, 0, -0.0016, 2e-4,
                  -5e-4, 3e-4, -0.001, -1e-4, 0.0016, 0.0016, -3e-4, 0.0012,
                  0.0012, -3e-4, 0.0027, -3e-4, 3e-4, -0.0026, 0.0037, -0.0017,
                  1e-4, 0.0016, 1e-4, -0.0015, 0.0024, 1e-4, 2e-4, -0.0039, 0,
                  -3e-4, -0.0033, -6e-4, 0.0017, -4e-4, -4e-4, 0.0012, 0.0018,
                  2e-4, -0.0012, -0.002, -0.0017, 0.0013, -0.001, 3e-4, 0.0021,
                  4e-4, -0.0012, -6e-4, -2e-4, 0, -4e-4, -9e-4, 0.0016, 0.0017,
                  4e-4, 7e-4, 7e-4, 0.001, 9e-4, -8e-4, 5e-4, 5e-4, 0.0023,
                  0.001, 0.0013, 2e-4, -4e-4, 2e-4, 0.0017, 8e-4, 3e-4, -1e-4,
                  9e-4, -4e-4, 0.0019, -5e-4, 3e-4, 0, -0.0025, 3e-4, 3e-4,
                  0.0011, 1e-4, -0.0015, -0.001, 7e-4, 7e-4, -7e-4, -7e-4, 8e-4,
                  0, 1e-4, 0.0013, -4e-4, 0.0012, 0.0014, 0.0017, 4e-4, 2e-4,
                  3e-4, -3e-4, -9e-4, 1e-4, 0, 0.001, -4e-4,
                ],
                expression: [
                  -0.0092, 2.8809, 1.416, 0.2018, 1.1982, -0.9351, 1.4492,
                  -0.1902, 0.1749, 0.0305, -0.167, -0.1572, -0.7354, -0.0492,
                  0.0115, 0.0608, 0.2971, 0.1179, 0.0046, -0.0997, -0.0041,
                  -0.0104, 0.3379, -0.1854, 0.009, 0.0366, -0.0583, 0.0269,
                  -0.0029, -0.4175, -8e-4, 0.1794, 0.0752, -0.0135, 0.1158,
                  0.1234, 5e-4, 0.003, -0.0032, 0.1034, -0.0504, -0.0055,
                  -0.0076, -0.0772, 0.224, 0.0047, 0.0229, -0.1044, 0.0162,
                  -0.0161, -0.0241, -0.0083, -0.1388, -0.0434, -0.0125, -0.0997,
                  -0.0327, -0.0111, 0.1576, -0.3911, 0.0199, 0.2522, 0.142,
                  0.0059, -0.0721, -0.0045, 0.031, -0.1136, -0.1685, 0.0641,
                  0.0142, 0.0312, 0.0426, -0.1366, 0.1011, 0.0101, -0.0157,
                  0.0018, -0.0103, -0.0344, 0.0907, 0.0016, 0.1168, -0.0806,
                  0.0104, -0.0057, 0.0111,
                ],
              },
              9: [
                {
                  mean: [0.0038, -0.2927, 0.833],
                  identity: [
                    6e-4, -0.0109, 0.0073, -6e-4, -0.0044, 0.0017, -1e-4,
                    -0.0022, -6e-4, -3e-4, 0.0065, -0.0014, -6e-4, -0.0051,
                    -0.0046, 3e-4, -0.0029, 0.003, 2e-4, 0.0038, -6e-4, 0,
                    -0.0012, 6e-4, -4e-4, 0.0053, -0.0075, -2e-4, -7e-4,
                    -0.0063, 0.0014, 0.0026, 0.0019, -0.0022, 0.0018, 0.0028,
                    -1e-4, -0.0012, 0.0011, 9e-4, 0.0019, -0.0019, -1e-4,
                    0.0012, -0.0022, -3e-4, -0.0012, 4e-4, -8e-4, 3e-4, -3e-4,
                    0, 0.0017, 0.0021, -4e-4, 0.0012, 0.0022, -3e-4, 0.0026,
                    -3e-4, 4e-4, -0.0026, 0.0032, -0.0019, 3e-4, 0.0015, 1e-4,
                    -0.0015, 0.0013, -1e-4, 1e-4, -0.0029, 0, -2e-4, -0.0028,
                    -7e-4, 0.0019, -3e-4, -2e-4, 0.0012, 9e-4, 4e-4, -0.001,
                    -0.002, -0.0016, 0.0011, -1e-4, 3e-4, 0.0021, 2e-4, -0.0014,
                    -9e-4, -1e-4, 0, -2e-4, -0.001, 0.0015, 0.0018, 1e-4, 7e-4,
                    8e-4, 0.0017, 0.001, -9e-4, 1e-4, 4e-4, 0.0023, -1e-4,
                    0.0012, 1e-4, -8e-4, 2e-4, 0.0018, 6e-4, 3e-4, 1e-4, 0.0012,
                    -3e-4, 0.002, -6e-4, 0, -1e-4, -0.0022, 4e-4, 5e-4, 0.0011,
                    2e-4, -0.0013, -0.0023, 6e-4, 6e-4, -5e-4, -5e-4, 9e-4,
                    2e-4, 2e-4, 0.0011, -3e-4, 0.0011, 0.0015, 0.0011, 3e-4,
                    2e-4, 8e-4, -4e-4, -8e-4, 3e-4, 0, 0.0012, -1e-4,
                  ],
                  expression: [
                    0.026, 0.1107, 0.3257, 0.1917, 0.3206, -1.1348, 1.0791,
                    -0.035, 0.1549, -0.0103, 0.6953, 1e-4, -0.3262, 0.068,
                    0.0219, -0.0044, 0.3643, 0.2178, 0.0168, -0.2478, -0.1321,
                    -0.0414, -0.3782, -0.0617, 0.5088, -0.0031, -0.0311,
                    -0.0497, 0.0948, -0.385, 0.0148, -0.2224, -0.1415, -0.0074,
                    0.0863, -0.203, 3e-4, -0.0081, 0.0057, 0.1164, -0.0039,
                    0.0015, -0.0024, 0.0505, 0.1532, 0.0039, -0.0148, -0.0753,
                    0.0163, 0.0058, -0.0339, 0.0036, 0.0252, -0.0569, -0.0041,
                    0.0163, -0.0361, 0.0035, -0.018, 0.1266, 0, -0.0163,
                    -0.0046, 0.0133, -0.1656, 0.2134, 0.0191, 0.0057, 0.0734,
                    0.0681, 0.0039, -0.0144, 0.029, -0.074, -0.046, 0.0122,
                    0.0072, -0.0162, -0.0349, -0.1234, 0.0212, -0.0355, 0.0535,
                    0.1218, 0.0043, -0.024, 0.0016,
                  ],
                },
                {
                  mean: [-0.0018, -0.3037, 0.8491],
                  identity: [
                    2e-4, -0.0112, 0.0077, -4e-4, -0.0044, 0.0024, 1e-4,
                    -0.0021, -4e-4, -4e-4, 0.0066, -0.002, -4e-4, -0.0052,
                    -0.0044, 3e-4, -0.0032, 0.0039, 4e-4, 0.0042, -3e-4, 2e-4,
                    -0.0012, -2e-4, -2e-4, 0.0052, -0.0083, -1e-4, -8e-4,
                    -0.0056, 0.0017, 0.0024, 0.0019, -0.0023, 0.002, 0.0027,
                    -2e-4, -0.0013, 0.002, 9e-4, 0.0017, -0.0028, -2e-4, 0.0012,
                    -0.0026, 0, -0.0016, 2e-4, -5e-4, 3e-4, -0.001, -1e-4,
                    0.0016, 0.0016, -3e-4, 0.0012, 0.0012, -3e-4, 0.0027, -3e-4,
                    3e-4, -0.0026, 0.0037, -0.0017, 1e-4, 0.0016, 1e-4, -0.0015,
                    0.0024, 1e-4, 2e-4, -0.0039, 0, -3e-4, -0.0033, -6e-4,
                    0.0017, -4e-4, -4e-4, 0.0012, 0.0018, 2e-4, -0.0012, -0.002,
                    -0.0017, 0.0013, -0.001, 3e-4, 0.0021, 4e-4, -0.0012, -6e-4,
                    -2e-4, 0, -4e-4, -9e-4, 0.0016, 0.0017, 4e-4, 7e-4, 7e-4,
                    0.001, 9e-4, -8e-4, 5e-4, 5e-4, 0.0023, 0.001, 0.0013, 2e-4,
                    -4e-4, 2e-4, 0.0017, 8e-4, 3e-4, -1e-4, 9e-4, -4e-4, 0.0019,
                    -5e-4, 3e-4, 0, -0.0025, 3e-4, 3e-4, 0.0011, 1e-4, -0.0015,
                    -0.001, 7e-4, 7e-4, -7e-4, -7e-4, 8e-4, 0, 1e-4, 0.0013,
                    -4e-4, 0.0012, 0.0014, 0.0017, 4e-4, 2e-4, 3e-4, -3e-4,
                    -9e-4, 1e-4, 0, 0.001, -4e-4,
                  ],
                  expression: [
                    -0.0092, 2.8809, 1.416, 0.2018, 1.1982, -0.9351, 1.4492,
                    -0.1902, 0.1749, 0.0305, -0.167, -0.1572, -0.7354, -0.0492,
                    0.0115, 0.0608, 0.2971, 0.1179, 0.0046, -0.0997, -0.0041,
                    -0.0104, 0.3379, -0.1854, 0.009, 0.0366, -0.0583, 0.0269,
                    -0.0029, -0.4175, -8e-4, 0.1794, 0.0752, -0.0135, 0.1158,
                    0.1234, 5e-4, 0.003, -0.0032, 0.1034, -0.0504, -0.0055,
                    -0.0076, -0.0772, 0.224, 0.0047, 0.0229, -0.1044, 0.0162,
                    -0.0161, -0.0241, -0.0083, -0.1388, -0.0434, -0.0125,
                    -0.0997, -0.0327, -0.0111, 0.1576, -0.3911, 0.0199, 0.2522,
                    0.142, 0.0059, -0.0721, -0.0045, 0.031, -0.1136, -0.1685,
                    0.0641, 0.0142, 0.0312, 0.0426, -0.1366, 0.1011, 0.0101,
                    -0.0157, 0.0018, -0.0103, -0.0344, 0.0907, 0.0016, 0.1168,
                    -0.0806, 0.0104, -0.0057, 0.0111,
                  ],
                },
              ],
              10: {
                mean: [-0.007, -0.6338, 0.7695],
                identity: [
                  1e-4, -0.0296, 0.0089, -6e-4, -0.0073, -0.0065, -1e-4,
                  -0.0029, -0.0031, -2e-4, 0.0128, 0.0065, 0, -0.0116, -0.014,
                  -1e-4, -0.0037, -0.0052, -5e-4, 0.0028, 0.003, -4e-4, 0.0041,
                  0.0015, 6e-4, 0.0088, -0.0076, -0.0011, -0.0015, -0.0073,
                  7e-4, -0.0011, 0.0019, -0.0011, -5e-4, 0.0031, -1e-4, -0.0018,
                  9e-4, 0.0018, 0.0038, 0.0068, -4e-4, -1e-4, 0.0061, 0.0024,
                  0.0024, -0.0066, -6e-4, 0.0051, 0.0014, 0.002, 0.005, -0.0035,
                  1e-4, -0.0034, -0.004, -7e-4, 0.001, -8e-4, 1e-4, -5e-4,
                  -0.0021, 2e-4, 0.0045, -0.0043, -0.0012, -0.0024, -0.0014,
                  6e-4, 0.0034, 0.0027, -8e-4, -0.0053, 0.0014, 1e-4, 0.0013,
                  -0.0018, 6e-4, -0.0015, 0.0029, -2e-4, -0.0035, 1e-4, -0.002,
                  0.0012, 0.0048, 0.0011, 1e-4, -2e-4, -3e-4, -0.0012, 0.0033,
                  6e-4, 0.002, -0.0033, 4e-4, 0.0028, 2e-4, 8e-4, -1e-4,
                  -0.0018, 8e-4, 0.0017, 1e-4, 9e-4, 8e-4, 3e-4, 0.0019, -0.001,
                  0.001, -7e-4, -0.0013, 0, 1e-4, 0.0032, -1e-4, 1e-4, 0.0011,
                  -4e-4, 5e-4, -7e-4, 0.0018, -3e-4, 2e-4, 7e-4, 8e-4, -0.0014,
                  7e-4, 0.0015, -6e-4, -1e-4, -4e-4, 0.0019, -9e-4, -6e-4,
                  -6e-4, -0.0012, 2e-4, -0.0012, -8e-4, 4e-4, 6e-4, -0.0011,
                  3e-4, 9e-4, -4e-4, 6e-4, -7e-4, -4e-4,
                ],
                expression: [
                  -0.0603, 2.0527, 1.9014, 0.1025, 0.6143, 0.3804, 0.7881,
                  -0.1023, -0.0764, 0.0454, -0.2487, -0.5073, -0.6704, -0.031,
                  -0.0181, 0.0466, 0.0651, -0.0726, -0.0033, -0.0022, 0.2944,
                  0.0101, 0.1669, -0.5225, -0.4685, 0.0236, 0.0079, 0.011,
                  0.2173, 0.4529, 0.0121, -0.2104, -0.0673, 0.0225, -0.4023,
                  0.0317, -9e-4, 0.0076, -0.0032, 0.0333, 0.0523, 0.0129,
                  -0.001, -0.0319, -0.0139, 0.0015, -0.0044, 0.0247, -5e-4,
                  0.0161, 0.0061, 0.0074, 0.0776, -0.0176, 0.007, 0.055, -0.017,
                  0.0052, -0.1819, 0.0294, -0.0161, -0.0337, 0.0226, -0.008,
                  -0.0297, 0.1967, -0.0095, 0.0383, 0.2039, 0.0434, 0.0271,
                  -0.0064, -0.0037, -0.0294, -0.024, 0.0024, -0.0137, -0.0209,
                  -0.0031, 0.0628, 0.1003, -0.0126, -0.056, -0.0097, -0.0012,
                  -0.0041, 0.0162,
                ],
              },
              11: {
                mean: [0.2505, 0.3833, 0.7793],
                identity: [
                  0.0098, 0.012, 0.0077, -6e-4, -3e-4, 0, 1e-4, 0.0082, -7e-4,
                  0.0019, -0.0036, -0.0012, 2e-4, 0.0119, -0.0039, 0.001, 1e-4,
                  0.0031, -0.0036, -0.0059, -7e-4, 0.0026, 0.0028, -0.0011,
                  9e-4, -0.0032, 8e-4, 0.0029, 0.0043, 3e-4, 0.0025, -9e-4,
                  0.0047, 0.0016, 0.0022, 0.0018, -0.001, 0.0025, -0.003,
                  -0.001, 0.0033, 0.0034, 4e-4, -0.0052, 0.0024, -2e-4, 0.001,
                  -0.0014, -6e-4, 0.0038, -0.0015, -6e-4, -0.001, -0.0011,
                  -4e-4, -0.001, 4e-4, -7e-4, 0.0036, -8e-4, -2e-4, -0.0019,
                  5e-4, 3e-4, -6e-4, -0.0024, -0.0017, -0.0014, 6e-4, -4e-4,
                  -0.0031, -0.0013, -6e-4, 0.0042, 2e-4, -2e-4, -0.002, -3e-4,
                  8e-4, 0.0018, -5e-4, -6e-4, -2e-4, -6e-4, 0.0025, 0.0019,
                  0.001, 8e-4, -0.0015, -0.0012, -1e-4, -6e-4, -4e-4, 0.0023,
                  -0.001, 6e-4, -2e-4, -0.001, 0, -9e-4, -0.002, -0.0011, 1e-4,
                  0, -1e-4, 5e-4, 6e-4, 9e-4, -6e-4, 5e-4, 8e-4, -1e-4, -2e-4,
                  -0.0017, -6e-4, -4e-4, 4e-4, -6e-4, 0.0012, 4e-4, 3e-4, -7e-4,
                  3e-4, -2e-4, 6e-4, 1e-4, 5e-4, -0.0019, -6e-4, 4e-4, 7e-4,
                  -1e-4, 1e-4, 5e-4, 0.001, -6e-4, -0.002, -7e-4, -5e-4, 5e-4,
                  3e-4, 7e-4, 0.0014, 0, 5e-4, -5e-4, -2e-4, 3e-4, -6e-4, -1e-4,
                ],
                expression: [
                  -9e-4, -3e-4, 0.0032, -0.003, -0.0034, -0.0031, 0.0014, 0,
                  4e-4, -0.0139, -0.0764, 0.0275, -0.002, -0.0089, 0.0031,
                  -0.0503, -0.0771, 0.038, -0.1323, -0.3523, 0.1368, -0.0474,
                  -0.0564, 0.0296, -0.0045, 0.007, -0.0013, 0.0153, 0.1259,
                  -0.0464, 0.0866, 0.2175, -0.0786, -0.0413, -0.1248, 0.0448,
                  -0.1777, -0.4607, 0.1782, -5e-4, -0.005, 0.0016, 0.0629,
                  0.1506, -0.0624, 0.0545, 0.2576, -0.0864, -0.0231, -0.0552,
                  0.0244, -0.0136, -0.0359, 0.0169, -0.1158, -0.2996, 0.1214,
                  -0.0235, -0.0354, 0.0165, -0.0745, -0.1079, 0.0475, -0.0116,
                  -0.0039, 0.0012, 0.0013, -0.0108, -8e-4, 0.0044, -0.0027,
                  -1e-4, -0.0694, 0.0363, 0.0071, 0.1462, -0.136, 0.0047, 0.009,
                  -0.0177, 0.0038, -0.0271, 0.0118, 0.0011, -0.0399, -0.0111,
                  0.0123,
                ],
              },
              12: {
                mean: [-0.2981, 0.3828, 0.7563],
                identity: [
                  -0.0116, 0.014, 0.0054, 0.0018, 5e-4, 0, -4e-4, 0.0068,
                  -0.0013, -0.0019, -0.0048, -5e-4, 5e-4, 0.0108, -0.0036,
                  -0.0029, -0.0018, 0.0029, 0.0043, -0.0077, 6e-4, -0.0017,
                  0.002, -0.0011, -0.0014, -0.0035, 0.0015, -0.0024, 0.0011,
                  4e-4, -0.0048, 2e-4, 0.0029, -1e-4, -1e-4, 0.003, 0.0019,
                  0.0035, -0.0016, -4e-4, 0.0039, 0.0019, 1e-4, -0.0064, 0.004,
                  3e-4, 0.002, -0.0021, 0.0017, 0.0011, -0.001, 0.0026, 0.0025,
                  -5e-4, 2e-4, -3e-4, -5e-4, -7e-4, 9e-4, -4e-4, -0.001,
                  -0.0022, 0.001, 9e-4, -0.0014, 7e-4, 0.0011, -0.001, -5e-4,
                  -8e-4, -0.0017, -0.0021, 9e-4, 0.0036, 5e-4, 4e-4, -0.0031,
                  6e-4, -0.0015, 0.0027, 2e-4, 1e-4, -0.0011, 2e-4, -0.0011,
                  -0.0018, 4e-4, -0.0013, -2e-4, 7e-4, 9e-4, -3e-4, 0.001,
                  -0.0021, 8e-4, 6e-4, -9e-4, 4e-4, -7e-4, 8e-4, -0.002,
                  -0.0013, 0, 7e-4, -0.0012, -1e-4, 0.0014, 0.0014, -1e-4,
                  0.0013, 6e-4, 6e-4, -0.0014, -0.0015, -9e-4, 1e-4, 1e-4, 9e-4,
                  7e-4, 0, 1e-4, -0.001, -4e-4, 0, -5e-4, 1e-4, -3e-4, 4e-4,
                  -5e-4, -1e-4, -0.0011, 2e-4, 0, 1e-4, 8e-4, 8e-4, 0, -7e-4,
                  -8e-4, 0, 2e-4, -1e-4, 0.001, 3e-4, 4e-4, -2e-4, 0, 5e-4,
                  0.0018, -1e-4,
                ],
                expression: [
                  0, -4e-4, 0.0028, 0.0036, -8e-4, -0.0026, -0.0015, -8e-4,
                  3e-4, 0.0075, -0.0608, 0.025, 0.0019, -0.0076, 0.0033, 0.0379,
                  -0.0437, 0.0335, 0.0964, -0.2452, 0.1233, 0.0368, -0.0251,
                  0.0253, 0.0033, 0.0097, -0.0021, -0.0095, 0.1171, -0.0475,
                  -0.064, 0.1548, -0.0718, 0.0228, -0.0831, 0.0343, -0.1924,
                  0.6206, -0.2771, 0.0021, -0.0143, 0.0056, -0.0705, 0.2522,
                  -0.1116, -0.0692, 0.4229, -0.1592, -0.0093, 0.05, -0.0185,
                  0.0948, -0.3196, 0.1437, -0.0184, 0.0194, -0.0131, 0.0205,
                  -0.0353, 0.0201, 0.0676, -0.135, 0.0672, 0.0137, -0.0311,
                  0.0118, 3e-4, -0.0077, -2e-4, -0.0151, 4e-4, -0.0058, 0.029,
                  -0.0139, 0.0163, 0.1324, 0.1819, -0.0039, 0.0406, 0.0501,
                  0.0017, 0.0331, 0.0161, 0.0062, -0.0235, -0.0446, 0.0047,
                ],
              },
            });
        },
        3115: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.FaceMesh =
              t.getFaceMesh =
              t.destroyFaceMesh =
              t.createFaceMesh =
                void 0);
          const n = r(887),
            a = r(4446);
          let i = 1,
            s = new Map();
          (t.createFaceMesh = function () {
            let e = i++;
            return s.set(e, new o()), a.zcout("face_mesh_t initialized"), e;
          }),
            (t.destroyFaceMesh = function (e) {
              s.delete(e);
            }),
            (t.getFaceMesh = function (e) {
              return s.get(e);
            });
          class o {
            constructor() {
              (this.render_mean_ = new Float32Array()),
                (this.render_identity_ = new Float32Array(50)),
                (this.render_expression_ = new Float32Array(29)),
                (this.render_uvs_ = new Float32Array()),
                (this.render_indices_ = new Uint16Array()),
                (this.vertices_ = new Float32Array()),
                (this.normals_ = new Float32Array()),
                (this.normalsCalculated_ = !1),
                (this.modelVersion_ = -1),
                (this.mirrored_ = !1);
            }
            loadFromMemory(e, t, r, n, a) {
              let i = 0,
                s = new Uint16Array(e),
                o = new Int32Array(e),
                c = new Float32Array(e),
                u = () => {
                  let e = o[i++] * o[i++],
                    t = c.subarray(i, i + e);
                  return (i += e), t;
                },
                _ = () => {
                  let e = o[i++],
                    t = s.subarray(2 * i, 2 * i + e);
                  return (i += e / 2), t;
                };
              (this.render_mean_ = u()),
                (this.render_identity_ = u()),
                (this.render_expression_ = u()),
                (this.render_uvs_ = u());
              let l = _(),
                f = i < o.length ? _() : new Uint16Array(),
                h = i < o.length ? _() : new Uint16Array(),
                d = i < o.length ? _() : new Uint16Array(),
                p = i < o.length ? _() : new Uint16Array();
              if (t || r || n || a) {
                let e = l.length;
                t && (e += f.length),
                  r && (e += h.length),
                  n && (e += d.length),
                  a && (e += p.length),
                  (this.render_indices_ = new Uint16Array(e)),
                  this.render_indices_.set(l, 0);
                let i = l.length;
                t && (this.render_indices_.set(f, i), (i += f.length)),
                  r && (this.render_indices_.set(h, i), (i += h.length)),
                  n && (this.render_indices_.set(d, i), (i += d.length)),
                  a && (this.render_indices_.set(p, i), (i += p.length));
              } else this.render_indices_ = l;
              (this.vertices_ = new Float32Array(this.render_mean_)),
                (this.normals_ = new Float32Array(this.vertices_.length)),
                this.modelVersion_++;
            }
            getVertices() {
              return this.vertices_;
            }
            getUVs() {
              return this.render_uvs_;
            }
            getIndices() {
              if (this.mirrored_) {
                if (!this.render_indices_reversed) {
                  this.render_indices_reversed = new Uint16Array(
                    this.render_indices_.length
                  );
                  for (let e = 0; e < this.render_indices_.length; e += 3)
                    (this.render_indices_reversed[e] =
                      this.render_indices_[e + 2]),
                      (this.render_indices_reversed[e + 1] =
                        this.render_indices_[e + 1]),
                      (this.render_indices_reversed[e + 2] =
                        this.render_indices_[e]);
                }
                return this.render_indices_reversed;
              }
              return this.render_indices_;
            }
            getNormals() {
              return (
                this.normalsCalculated_ || this.calculateNormals(),
                this.normals_
              );
            }
            getModelVersion() {
              return this.modelVersion_;
            }
            getLandmarkDataForVertex(e) {
              let t = [
                  this.render_mean_[3 * e],
                  this.render_mean_[3 * e + 1],
                  this.render_mean_[3 * e + 2],
                ],
                r = [];
              for (let t = 0; t < 50; t++)
                r.push(this.render_identity_[3 * e * 50 + t]),
                  r.push(this.render_identity_[50 * (3 * e + 1) + t]),
                  r.push(this.render_identity_[50 * (3 * e + 2) + t]);
              let n = [];
              for (let t = 0; t < 29; t++)
                n.push(this.render_expression_[3 * e * 29 + t]),
                  n.push(this.render_expression_[29 * (3 * e + 1) + t]),
                  n.push(this.render_expression_[29 * (3 * e + 2) + t]);
              return { mean: t, identity: r, expression: n };
            }
            update(e, t, r) {
              if (
                0 !== this.render_mean_.length &&
                0 !== this.render_identity_.length &&
                0 !== this.render_expression_.length
              ) {
                (this.mirrored_ = r), this.vertices_.set(this.render_mean_);
                for (let t = 0; t < e.length; t++)
                  for (let r = 0; r < this.vertices_.length; r++)
                    this.vertices_[r] +=
                      e[t] * this.render_identity_[r * e.length + t];
                for (let e = 0; e < t.length; e++)
                  for (let r = 0; r < this.vertices_.length; r++)
                    this.vertices_[r] +=
                      t[e] * this.render_expression_[r * t.length + e];
                if (r)
                  for (let e = 0; e < this.vertices_.length; e += 3)
                    this.vertices_[e] *= -1;
                this.normalsCalculated_ = !1;
              }
            }
            calculateNormals() {
              let e = this.getIndices(),
                t = this.vertices_,
                r = new Float32Array(e.length);
              if (!t) return;
              let a = e.length,
                i = this.normals_,
                s = new Float32Array([0, 0, 0]),
                o = new Float32Array([0, 0, 0]),
                c = new Float32Array([0, 0, 0]);
              for (let i = 0; i < a; i += 3) {
                let a = 3 * e[i],
                  u = 3 * e[i + 1],
                  _ = 3 * e[i + 2];
                (s[0] = t[u] - t[a]),
                  (s[1] = t[u + 1] - t[a + 1]),
                  (s[2] = t[u + 2] - t[a + 2]),
                  (o[0] = t[_] - t[a]),
                  (o[1] = t[_ + 1] - t[a + 1]),
                  (o[2] = t[_ + 2] - t[a + 2]),
                  n.vec3.cross(c, s, o);
                let l = n.vec3.length(c);
                (r[i] = c[0] / l), (r[i + 1] = c[1] / l), (r[i + 2] = c[2] / l);
              }
              i.fill(0);
              for (let t = 0; t < a; t += 3) {
                let n = 3 * e[t],
                  a = 3 * e[t + 1],
                  s = 3 * e[t + 2];
                (i[n] += r[t]),
                  (i[n + 1] += r[t + 1]),
                  (i[n + 2] += r[t + 2]),
                  (i[a] += r[t]),
                  (i[a + 1] += r[t + 1]),
                  (i[a + 2] += r[t + 2]),
                  (i[s] += r[t]),
                  (i[s + 1] += r[t + 1]),
                  (i[s + 2] += r[t + 2]);
              }
              let u = i.length / 3;
              for (let e = 0; e < u; e++) {
                let t = 3 * e;
                (s[0] = i[t]),
                  (s[1] = i[t + 1]),
                  (s[2] = i[t + 2]),
                  n.vec3.normalize(o, s),
                  (i[t] = o[0]),
                  (i[t + 1] = o[1]),
                  (i[t + 2] = o[2]);
              }
              this.normalsCalculated_ = !0;
            }
          }
          t.FaceMesh = o;
        },
        1823: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.zappar_client = void 0);
          const n = r(7476),
            a = r(1810);
          t.zappar_client = class {
            constructor(e) {
              (this._messageSender = e),
                (this._globalState = { log_level: 1 }),
                (this.serializer = new n.MessageSerializer((e) => {
                  this._messageSender(e);
                })),
                (this.deserializer = new a.MessageDeserializer()),
                (this._latestId = 1),
                (this._pipeline_state_by_instance = new Map()),
                (this._camera_source_state_by_instance = new Map()),
                (this._image_tracker_state_by_instance = new Map()),
                (this._face_tracker_state_by_instance = new Map()),
                (this._face_mesh_state_by_instance = new Map()),
                (this._face_landmark_state_by_instance = new Map()),
                (this._barcode_finder_state_by_instance = new Map()),
                (this._instant_world_tracker_state_by_instance = new Map()),
                (this.impl = {
                  log_level: () => this._globalState.log_level,
                  log_level_set: (e) => {
                    this.serializer.sendMessage(33, (t) => {
                      t.logLevel(e);
                    });
                  },
                  analytics_project_id_set: (e) => {
                    this.serializer.sendMessage(30, (t) => {
                      t.string(e);
                    });
                  },
                  pipeline_create: () => {
                    let e = this._latestId++,
                      t = {
                        current_frame_user_data: 0,
                        camera_model: new Float32Array([
                          300, 300, 160, 120, 0, 0,
                        ]),
                        camera_pose: new Float32Array([
                          1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
                        ]),
                        camera_frame_camera_attitude: new Float32Array([
                          1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
                        ]),
                        frame_number: 0,
                      };
                    return (
                      this._pipeline_state_by_instance.set(e, t),
                      this.serializer.sendMessage(26, (t) => {
                        t.type(e);
                      }),
                      e
                    );
                  },
                  pipeline_destroy: (e) => {
                    if (!this._pipeline_state_by_instance.get(e))
                      throw new Error("This object has been destroyed");
                    this._pipeline_state_by_instance.delete(e),
                      this.serializer.sendMessage(27, (t) => {
                        t.type(e);
                      });
                  },
                  pipeline_frame_update: (e) => {
                    if (!this._pipeline_state_by_instance.get(e))
                      throw new Error("This object has been destroyed");
                    this.serializer.sendMessage(9, (t) => {
                      t.type(e);
                    });
                  },
                  pipeline_frame_number: (e) => {
                    let t = this._pipeline_state_by_instance.get(e);
                    if (!t) throw new Error("This object has been destroyed");
                    return t.frame_number;
                  },
                  pipeline_camera_model: (e) => {
                    let t = this._pipeline_state_by_instance.get(e);
                    if (!t) throw new Error("This object has been destroyed");
                    return t.camera_model;
                  },
                  pipeline_camera_frame_user_data: (e) => {
                    let t = this._pipeline_state_by_instance.get(e);
                    if (!t) throw new Error("This object has been destroyed");
                    return t.current_frame_user_data;
                  },
                  pipeline_camera_frame_submit: (e, t, r, n, a, i) => {
                    if (!this._pipeline_state_by_instance.get(e))
                      throw new Error("This object has been destroyed");
                    this.serializer.sendMessage(8, (s) => {
                      s.type(e),
                        s.dataWithLength(t),
                        s.int(r),
                        s.int(n),
                        s.int(a),
                        s.matrix4x4(i);
                    });
                  },
                  pipeline_camera_frame_camera_attitude: (e) => {
                    let t = this._pipeline_state_by_instance.get(e);
                    if (!t) throw new Error("This object has been destroyed");
                    return t.camera_frame_camera_attitude;
                  },
                  pipeline_motion_accelerometer_submit: (e, t, r, n, a) => {
                    if (!this._pipeline_state_by_instance.get(e))
                      throw new Error("This object has been destroyed");
                    this.serializer.sendMessage(10, (i) => {
                      i.type(e),
                        i.timestamp(t),
                        i.float(r),
                        i.float(n),
                        i.float(a);
                    });
                  },
                  pipeline_motion_rotation_rate_submit: (e, t, r, n, a) => {
                    if (!this._pipeline_state_by_instance.get(e))
                      throw new Error("This object has been destroyed");
                    this.serializer.sendMessage(11, (i) => {
                      i.type(e),
                        i.timestamp(t),
                        i.float(r),
                        i.float(n),
                        i.float(a);
                    });
                  },
                  pipeline_motion_attitude_submit: (e, t, r, n, a) => {
                    if (!this._pipeline_state_by_instance.get(e))
                      throw new Error("This object has been destroyed");
                    this.serializer.sendMessage(12, (i) => {
                      i.type(e),
                        i.timestamp(t),
                        i.float(r),
                        i.float(n),
                        i.float(a);
                    });
                  },
                  camera_source_create: (e, t) => {
                    let r = this._latestId++;
                    return (
                      this._camera_source_state_by_instance.set(r, {}),
                      this.serializer.sendMessage(28, (n) => {
                        n.type(r), n.type(e), n.string(t);
                      }),
                      r
                    );
                  },
                  camera_source_destroy: (e) => {
                    if (!this._camera_source_state_by_instance.get(e))
                      throw new Error("This object has been destroyed");
                    this._camera_source_state_by_instance.delete(e),
                      this.serializer.sendMessage(29, (t) => {
                        t.type(e);
                      });
                  },
                  image_tracker_create: (e) => {
                    let t = this._latestId++;
                    return (
                      this._image_tracker_state_by_instance.set(t, {
                        enabled: !0,
                        target_loaded_version: -1,
                        target_count: 0,
                        anchor_count: 0,
                        anchor_id: [],
                        anchor_pose: [],
                      }),
                      this.serializer.sendMessage(2, (r) => {
                        r.type(t), r.type(e);
                      }),
                      t
                    );
                  },
                  image_tracker_destroy: (e) => {
                    if (!this._image_tracker_state_by_instance.get(e))
                      throw new Error("This object has been destroyed");
                    this._image_tracker_state_by_instance.delete(e),
                      this.serializer.sendMessage(13, (t) => {
                        t.type(e);
                      });
                  },
                  image_tracker_target_load_from_memory: (e, t) => {
                    if (!this._image_tracker_state_by_instance.get(e))
                      throw new Error("This object has been destroyed");
                    this.serializer.sendMessage(4, (r) => {
                      r.type(e), r.dataWithLength(t);
                    });
                  },
                  image_tracker_target_loaded_version: (e) => {
                    let t = this._image_tracker_state_by_instance.get(e);
                    if (!t) throw new Error("This object has been destroyed");
                    return t.target_loaded_version;
                  },
                  image_tracker_target_count: (e) => {
                    let t = this._image_tracker_state_by_instance.get(e);
                    if (!t) throw new Error("This object has been destroyed");
                    return t.target_count;
                  },
                  image_tracker_enabled: (e) => {
                    let t = this._image_tracker_state_by_instance.get(e);
                    if (!t) throw new Error("This object has been destroyed");
                    return t.enabled;
                  },
                  image_tracker_enabled_set: (e, t) => {
                    if (!this._image_tracker_state_by_instance.get(e))
                      throw new Error("This object has been destroyed");
                    this.serializer.sendMessage(3, (r) => {
                      r.type(e), r.bool(t);
                    });
                  },
                  image_tracker_anchor_count: (e) => {
                    let t = this._image_tracker_state_by_instance.get(e);
                    if (!t) throw new Error("This object has been destroyed");
                    return t.anchor_count;
                  },
                  image_tracker_anchor_id: (e, t) => {
                    let r = this._image_tracker_state_by_instance.get(e);
                    if (!r) throw new Error("This object has been destroyed");
                    return r.anchor_id[t];
                  },
                  image_tracker_anchor_pose_raw: (e, t) => {
                    let r = this._image_tracker_state_by_instance.get(e);
                    if (!r) throw new Error("This object has been destroyed");
                    return r.anchor_pose[t];
                  },
                  face_tracker_create: (e) => {
                    let t = this._latestId++;
                    return (
                      this._face_tracker_state_by_instance.set(t, {
                        enabled: !0,
                        model_loaded: -1,
                        max_faces: 1,
                        anchor_count: 0,
                        anchor_id: [],
                        anchor_pose: [],
                        anchor_identity_coefficients: [],
                        anchor_expression_coefficients: [],
                      }),
                      this.serializer.sendMessage(19, (r) => {
                        r.type(t), r.type(e);
                      }),
                      t
                    );
                  },
                  face_tracker_destroy: (e) => {
                    if (!this._face_tracker_state_by_instance.get(e))
                      throw new Error("This object has been destroyed");
                    this._face_tracker_state_by_instance.delete(e),
                      this.serializer.sendMessage(20, (t) => {
                        t.type(e);
                      });
                  },
                  face_tracker_model_load_from_memory: (e, t) => {
                    if (!this._face_tracker_state_by_instance.get(e))
                      throw new Error("This object has been destroyed");
                    this.serializer.sendMessage(21, (r) => {
                      r.type(e), r.dataWithLength(t);
                    });
                  },
                  face_tracker_model_loaded_version: (e) => {
                    let t = this._face_tracker_state_by_instance.get(e);
                    if (!t) throw new Error("This object has been destroyed");
                    return t.model_loaded;
                  },
                  face_tracker_enabled_set: (e, t) => {
                    if (!this._face_tracker_state_by_instance.get(e))
                      throw new Error("This object has been destroyed");
                    this.serializer.sendMessage(22, (r) => {
                      r.type(e), r.bool(t);
                    });
                  },
                  face_tracker_enabled: (e) => {
                    let t = this._face_tracker_state_by_instance.get(e);
                    if (!t) throw new Error("This object has been destroyed");
                    return t.enabled;
                  },
                  face_tracker_max_faces_set: (e, t) => {
                    if (!this._face_tracker_state_by_instance.get(e))
                      throw new Error("This object has been destroyed");
                    this.serializer.sendMessage(23, (r) => {
                      r.type(e), r.int(t);
                    });
                  },
                  face_tracker_max_faces: (e) => {
                    let t = this._face_tracker_state_by_instance.get(e);
                    if (!t) throw new Error("This object has been destroyed");
                    return t.max_faces;
                  },
                  face_tracker_anchor_count: (e) => {
                    let t = this._face_tracker_state_by_instance.get(e);
                    if (!t) throw new Error("This object has been destroyed");
                    return t.anchor_count;
                  },
                  face_tracker_anchor_id: (e, t) => {
                    let r = this._face_tracker_state_by_instance.get(e);
                    if (!r) throw new Error("This object has been destroyed");
                    return r.anchor_id[t];
                  },
                  face_tracker_anchor_pose_raw: (e, t) => {
                    let r = this._face_tracker_state_by_instance.get(e);
                    if (!r) throw new Error("This object has been destroyed");
                    return r.anchor_pose[t];
                  },
                  face_tracker_anchor_identity_coefficients: (e, t) => {
                    let r = this._face_tracker_state_by_instance.get(e);
                    if (!r) throw new Error("This object has been destroyed");
                    return r.anchor_identity_coefficients[t];
                  },
                  face_tracker_anchor_expression_coefficients: (e, t) => {
                    let r = this._face_tracker_state_by_instance.get(e);
                    if (!r) throw new Error("This object has been destroyed");
                    return r.anchor_expression_coefficients[t];
                  },
                  face_mesh_create: () => {
                    let e = this._latestId++;
                    return (
                      this._face_mesh_state_by_instance.set(e, {}),
                      this.serializer.sendMessage(24, (t) => {
                        t.type(e);
                      }),
                      e
                    );
                  },
                  face_mesh_destroy: (e) => {
                    if (!this._face_mesh_state_by_instance.get(e))
                      throw new Error("This object has been destroyed");
                    this._face_mesh_state_by_instance.delete(e),
                      this.serializer.sendMessage(25, (t) => {
                        t.type(e);
                      });
                  },
                  face_landmark_create: (e) => {
                    let t = this._latestId++;
                    return (
                      this._face_landmark_state_by_instance.set(t, {}),
                      this.serializer.sendMessage(31, (r) => {
                        r.type(t), r.faceLandmarkName(e);
                      }),
                      t
                    );
                  },
                  face_landmark_destroy: (e) => {
                    if (!this._face_landmark_state_by_instance.get(e))
                      throw new Error("This object has been destroyed");
                    this._face_landmark_state_by_instance.delete(e),
                      this.serializer.sendMessage(32, (t) => {
                        t.type(e);
                      });
                  },
                  barcode_finder_create: (e) => {
                    let t = this._latestId++;
                    return (
                      this._barcode_finder_state_by_instance.set(t, {
                        enabled: !0,
                        number_found: 0,
                        found_text: [],
                        found_format: [],
                        formats: 131071,
                      }),
                      this.serializer.sendMessage(15, (r) => {
                        r.type(t), r.type(e);
                      }),
                      t
                    );
                  },
                  barcode_finder_destroy: (e) => {
                    if (!this._barcode_finder_state_by_instance.get(e))
                      throw new Error("This object has been destroyed");
                    this._barcode_finder_state_by_instance.delete(e),
                      this.serializer.sendMessage(16, (t) => {
                        t.type(e);
                      });
                  },
                  barcode_finder_enabled_set: (e, t) => {
                    if (!this._barcode_finder_state_by_instance.get(e))
                      throw new Error("This object has been destroyed");
                    this.serializer.sendMessage(17, (r) => {
                      r.type(e), r.bool(t);
                    });
                  },
                  barcode_finder_enabled: (e) => {
                    let t = this._barcode_finder_state_by_instance.get(e);
                    if (!t) throw new Error("This object has been destroyed");
                    return t.enabled;
                  },
                  barcode_finder_found_number: (e) => {
                    let t = this._barcode_finder_state_by_instance.get(e);
                    if (!t) throw new Error("This object has been destroyed");
                    return t.number_found;
                  },
                  barcode_finder_found_text: (e, t) => {
                    let r = this._barcode_finder_state_by_instance.get(e);
                    if (!r) throw new Error("This object has been destroyed");
                    return r.found_text[t];
                  },
                  barcode_finder_found_format: (e, t) => {
                    let r = this._barcode_finder_state_by_instance.get(e);
                    if (!r) throw new Error("This object has been destroyed");
                    return r.found_format[t];
                  },
                  barcode_finder_formats: (e) => {
                    let t = this._barcode_finder_state_by_instance.get(e);
                    if (!t) throw new Error("This object has been destroyed");
                    return t.formats;
                  },
                  barcode_finder_formats_set: (e, t) => {
                    if (!this._barcode_finder_state_by_instance.get(e))
                      throw new Error("This object has been destroyed");
                    this.serializer.sendMessage(18, (r) => {
                      r.type(e), r.barcodeFormat(t);
                    });
                  },
                  instant_world_tracker_create: (e) => {
                    let t = this._latestId++,
                      r = {
                        enabled: !0,
                        pose: new Float32Array([
                          1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
                        ]),
                      };
                    return (
                      this._instant_world_tracker_state_by_instance.set(t, r),
                      this.serializer.sendMessage(5, (r) => {
                        r.type(t), r.type(e);
                      }),
                      t
                    );
                  },
                  instant_world_tracker_destroy: (e) => {
                    if (!this._instant_world_tracker_state_by_instance.get(e))
                      throw new Error("This object has been destroyed");
                    this._instant_world_tracker_state_by_instance.delete(e),
                      this.serializer.sendMessage(14, (t) => {
                        t.type(e);
                      });
                  },
                  instant_world_tracker_enabled_set: (e, t) => {
                    if (!this._instant_world_tracker_state_by_instance.get(e))
                      throw new Error("This object has been destroyed");
                    this.serializer.sendMessage(6, (r) => {
                      r.type(e), r.bool(t);
                    });
                  },
                  instant_world_tracker_enabled: (e) => {
                    let t =
                      this._instant_world_tracker_state_by_instance.get(e);
                    if (!t) throw new Error("This object has been destroyed");
                    return t.enabled;
                  },
                  instant_world_tracker_anchor_pose_raw: (e) => {
                    let t =
                      this._instant_world_tracker_state_by_instance.get(e);
                    if (!t) throw new Error("This object has been destroyed");
                    return t.pose;
                  },
                  instant_world_tracker_anchor_pose_set_from_camera_offset: (
                    e,
                    t,
                    r,
                    n,
                    a
                  ) => {
                    if (!this._instant_world_tracker_state_by_instance.get(e))
                      throw new Error("This object has been destroyed");
                    this.serializer.sendMessage(7, (i) => {
                      i.type(e),
                        i.float(t),
                        i.float(r),
                        i.float(n),
                        i.instantTrackerTransformOrientation(a);
                    });
                  },
                });
            }
            processMessages(e) {
              this.deserializer.setData(e),
                this.deserializer.forMessages((e, t) => {
                  switch (e) {
                    case 7: {
                      let e = t.type(),
                        r = this._pipeline_state_by_instance.get(e);
                      if (!r) return;
                      r.frame_number = t.int();
                      break;
                    }
                    case 6: {
                      let e = t.type(),
                        r = this._pipeline_state_by_instance.get(e);
                      if (!r) return;
                      r.camera_model = t.cameraModel();
                      break;
                    }
                    case 5: {
                      let e = t.type(),
                        r = this._pipeline_state_by_instance.get(e);
                      if (!r) return;
                      r.current_frame_user_data = t.int();
                      break;
                    }
                    case 11: {
                      let e = t.type(),
                        r = this._pipeline_state_by_instance.get(e);
                      if (!r) return;
                      r.camera_frame_camera_attitude = t.matrix4x4();
                      break;
                    }
                    case 18: {
                      let e = t.type(),
                        r = this._image_tracker_state_by_instance.get(e);
                      if (!r) return;
                      r.target_loaded_version = t.int();
                      break;
                    }
                    case 20: {
                      let e = t.type(),
                        r = this._image_tracker_state_by_instance.get(e);
                      if (!r) return;
                      r.target_count = t.int();
                      break;
                    }
                    case 1: {
                      let e = t.type(),
                        r = this._image_tracker_state_by_instance.get(e);
                      if (!r) return;
                      r.anchor_count = t.int();
                      break;
                    }
                    case 2: {
                      let e = t.type(),
                        r = this._image_tracker_state_by_instance.get(e);
                      if (!r) return;
                      let n = t.int();
                      r.anchor_id[n] = t.string();
                      break;
                    }
                    case 3: {
                      let e = t.type(),
                        r = this._image_tracker_state_by_instance.get(e);
                      if (!r) return;
                      let n = t.int();
                      r.anchor_pose[n] = t.matrix4x4();
                      break;
                    }
                    case 17: {
                      let e = t.type(),
                        r = this._face_tracker_state_by_instance.get(e);
                      if (!r) return;
                      r.model_loaded = t.int();
                      break;
                    }
                    case 12: {
                      let e = t.type(),
                        r = this._face_tracker_state_by_instance.get(e);
                      if (!r) return;
                      r.anchor_count = t.int();
                      break;
                    }
                    case 13: {
                      let e = t.type(),
                        r = this._face_tracker_state_by_instance.get(e);
                      if (!r) return;
                      let n = t.int();
                      r.anchor_id[n] = t.string();
                      break;
                    }
                    case 14: {
                      let e = t.type(),
                        r = this._face_tracker_state_by_instance.get(e);
                      if (!r) return;
                      let n = t.int();
                      r.anchor_pose[n] = t.matrix4x4();
                      break;
                    }
                    case 15: {
                      let e = t.type(),
                        r = this._face_tracker_state_by_instance.get(e);
                      if (!r) return;
                      let n = t.int();
                      r.anchor_identity_coefficients[n] =
                        t.identityCoefficients();
                      break;
                    }
                    case 16: {
                      let e = t.type(),
                        r = this._face_tracker_state_by_instance.get(e);
                      if (!r) return;
                      let n = t.int();
                      r.anchor_expression_coefficients[n] =
                        t.expressionCoefficients();
                      break;
                    }
                    case 8: {
                      let e = t.type(),
                        r = this._barcode_finder_state_by_instance.get(e);
                      if (!r) return;
                      r.number_found = t.int();
                      break;
                    }
                    case 9: {
                      let e = t.type(),
                        r = this._barcode_finder_state_by_instance.get(e);
                      if (!r) return;
                      let n = t.int();
                      r.found_text[n] = t.string();
                      break;
                    }
                    case 10: {
                      let e = t.type(),
                        r = this._barcode_finder_state_by_instance.get(e);
                      if (!r) return;
                      let n = t.int();
                      r.found_format[n] = t.barcodeFormat();
                      break;
                    }
                    case 4: {
                      let e = t.type(),
                        r =
                          this._instant_world_tracker_state_by_instance.get(e);
                      if (!r) return;
                      r.pose = t.matrix4x4();
                      break;
                    }
                  }
                });
            }
          };
        },
        7635: (e, t) => {
          "use strict";
          var r, n, a, i;
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.log_level_t =
              t.instant_world_tracker_transform_orientation_t =
              t.face_landmark_name_t =
              t.barcode_format_t =
                void 0),
            ((i = t.barcode_format_t || (t.barcode_format_t = {}))[
              (i.UNKNOWN = 131072)
            ] = "UNKNOWN"),
            (i[(i.AZTEC = 1)] = "AZTEC"),
            (i[(i.CODABAR = 2)] = "CODABAR"),
            (i[(i.CODE_39 = 4)] = "CODE_39"),
            (i[(i.CODE_93 = 8)] = "CODE_93"),
            (i[(i.CODE_128 = 16)] = "CODE_128"),
            (i[(i.DATA_MATRIX = 32)] = "DATA_MATRIX"),
            (i[(i.EAN_8 = 64)] = "EAN_8"),
            (i[(i.EAN_13 = 128)] = "EAN_13"),
            (i[(i.ITF = 256)] = "ITF"),
            (i[(i.MAXICODE = 512)] = "MAXICODE"),
            (i[(i.PDF_417 = 1024)] = "PDF_417"),
            (i[(i.QR_CODE = 2048)] = "QR_CODE"),
            (i[(i.RSS_14 = 4096)] = "RSS_14"),
            (i[(i.RSS_EXPANDED = 8192)] = "RSS_EXPANDED"),
            (i[(i.UPC_A = 16384)] = "UPC_A"),
            (i[(i.UPC_E = 32768)] = "UPC_E"),
            (i[(i.UPC_EAN_EXTENSION = 65536)] = "UPC_EAN_EXTENSION"),
            (i[(i.ALL = 131071)] = "ALL"),
            ((a = t.face_landmark_name_t || (t.face_landmark_name_t = {}))[
              (a.EYE_LEFT = 0)
            ] = "EYE_LEFT"),
            (a[(a.EYE_RIGHT = 1)] = "EYE_RIGHT"),
            (a[(a.EAR_LEFT = 2)] = "EAR_LEFT"),
            (a[(a.EAR_RIGHT = 3)] = "EAR_RIGHT"),
            (a[(a.NOSE_BRIDGE = 4)] = "NOSE_BRIDGE"),
            (a[(a.NOSE_TIP = 5)] = "NOSE_TIP"),
            (a[(a.NOSE_BASE = 6)] = "NOSE_BASE"),
            (a[(a.LIP_TOP = 7)] = "LIP_TOP"),
            (a[(a.LIP_BOTTOM = 8)] = "LIP_BOTTOM"),
            (a[(a.MOUTH_CENTER = 9)] = "MOUTH_CENTER"),
            (a[(a.CHIN = 10)] = "CHIN"),
            (a[(a.EYEBROW_LEFT = 11)] = "EYEBROW_LEFT"),
            (a[(a.EYEBROW_RIGHT = 12)] = "EYEBROW_RIGHT"),
            ((n =
              t.instant_world_tracker_transform_orientation_t ||
              (t.instant_world_tracker_transform_orientation_t = {}))[
              (n.WORLD = 3)
            ] = "WORLD"),
            (n[(n.MINUS_Z_AWAY_FROM_USER = 4)] = "MINUS_Z_AWAY_FROM_USER"),
            (n[(n.MINUS_Z_HEADING = 5)] = "MINUS_Z_HEADING"),
            (n[(n.UNCHANGED = 6)] = "UNCHANGED"),
            ((r = t.log_level_t || (t.log_level_t = {}))[
              (r.LOG_LEVEL_NONE = 0)
            ] = "LOG_LEVEL_NONE"),
            (r[(r.LOG_LEVEL_ERROR = 1)] = "LOG_LEVEL_ERROR"),
            (r[(r.LOG_LEVEL_WARNING = 2)] = "LOG_LEVEL_WARNING"),
            (r[(r.LOG_LEVEL_VERBOSE = 3)] = "LOG_LEVEL_VERBOSE");
        },
        1319: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.log_level_t =
              t.instant_world_tracker_transform_orientation_t =
              t.face_landmark_name_t =
              t.barcode_format_t =
                void 0);
          var n = r(7635);
          Object.defineProperty(t, "barcode_format_t", {
            enumerable: !0,
            get: function () {
              return n.barcode_format_t;
            },
          });
          var a = r(7635);
          Object.defineProperty(t, "face_landmark_name_t", {
            enumerable: !0,
            get: function () {
              return a.face_landmark_name_t;
            },
          });
          var i = r(7635);
          Object.defineProperty(
            t,
            "instant_world_tracker_transform_orientation_t",
            {
              enumerable: !0,
              get: function () {
                return i.instant_world_tracker_transform_orientation_t;
              },
            }
          );
          var s = r(7635);
          Object.defineProperty(t, "log_level_t", {
            enumerable: !0,
            get: function () {
              return s.log_level_t;
            },
          });
        },
        5952: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.HTMLElementSource = void 0);
          const n = r(9988),
            a = r(846),
            i = r(1120),
            s = r(9705),
            o = r(887),
            c = r(4446);
          let u = 1,
            _ = new Map();
          class l extends a.Source {
            constructor(e, t) {
              super(),
                (this._video = e),
                (this._pipeline = t),
                (this._isPaused = !0),
                (this._hadFrames = !1),
                (this._isUserFacing = !1),
                (this._cameraToScreenRotation = 0),
                (this._isUploadFrame = !0),
                (this._computedTransformRotation = -1),
                (this._computedFrontCameraRotation = !1),
                (this._cameraUvTransform = o.mat4.create()),
                (this._cameraVertexTransform = [
                  1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
                ]),
                (this._framebufferWidth = 0),
                (this._framebufferHeight = 0),
                (this._framebufferId = null),
                (this._renderTexture = null);
              let r = this._video;
              this._video instanceof HTMLVideoElement
                ? r.addEventListener("loadedmetadata", () => {
                    this._hadFrames = !0;
                  })
                : (this._hadFrames = !0),
                (this._resetGLContext = this._resetGLContext.bind(this));
              let a = n.Pipeline.get(this._pipeline);
              a && a.onGLContextReset.bind(this._resetGLContext);
            }
            static createVideoElementSource(e, t) {
              let r = u++;
              return (
                _.set(r, new l(t, e)),
                c.zcout("html_element_source_t initialized"),
                r
              );
            }
            static getVideoElementSource(e) {
              return _.get(e);
            }
            _resetGLContext() {
              (this._currentVideoTexture = void 0),
                (this._framebufferId = null),
                (this._renderTexture = null),
                (this._vertexBuffer = void 0),
                (this._indexBuffer = void 0),
                (this._greyscaleShader = void 0);
            }
            destroy() {
              let e = n.Pipeline.get(this._pipeline);
              e && e.onGLContextReset.unbind(this._resetGLContext),
                this.pause(),
                this._resetGLContext();
            }
            pause() {
              this._isPaused = !0;
              let e = n.Pipeline.get(this._pipeline);
              e &&
                e.currentCameraSource === this &&
                (e.currentCameraSource = void 0);
            }
            start() {
              var e;
              this._isPaused &&
                ((this._isUploadFrame = !0),
                this._video instanceof HTMLVideoElement &&
                  (this._hadFrames = !1)),
                (this._isPaused = !1);
              let t = n.Pipeline.get(this._pipeline);
              t &&
                t.currentCameraSource !== this &&
                (null === (e = t.currentCameraSource) ||
                  void 0 === e ||
                  e.pause(),
                (t.currentCameraSource = this));
            }
            getFrame(e) {
              let t = n.Pipeline.get(this._pipeline);
              if (!t) return;
              let r = t.glContext;
              if (r && !this._isPaused && this._hadFrames)
                try {
                  return this._processFrame(r, this._cameraToScreenRotation, e);
                } catch (e) {
                  console.log("Unable to process frame");
                }
            }
            _processFrame(e, t, r) {
              let a = n.Pipeline.get(this._pipeline);
              if (a) {
                if (this._isUploadFrame)
                  return (
                    this._currentVideoTexture ||
                      (this._currentVideoTexture = a.getVideoTexture()),
                    this._uploadFrame(t, this._isUserFacing),
                    void (this._isUploadFrame = !this._isUploadFrame)
                  );
                if (!r)
                  return (
                    (this._isUploadFrame = !this._isUploadFrame),
                    this._readFrame(a, e)
                  );
              }
            }
            _uploadFrame(e, t) {
              if (!this._currentVideoTexture) return;
              let r = n.Pipeline.get(this._pipeline);
              if (!r) return;
              let a = r.glContext;
              if (!a) return;
              a.disable(a.SCISSOR_TEST),
                a.disable(a.DEPTH_TEST),
                a.disable(a.BLEND),
                a.disable(a.CULL_FACE),
                a.pixelStorei(a.UNPACK_FLIP_Y_WEBGL, !1),
                a.activeTexture(a.TEXTURE0),
                a.bindTexture(a.TEXTURE_2D, this._currentVideoTexture);
              const s = a.RGBA,
                o = a.RGBA,
                c = a.UNSIGNED_BYTE;
              a.texImage2D(a.TEXTURE_2D, 0, s, o, c, this._video);
              let u = 0,
                _ = 0;
              this._video instanceof HTMLVideoElement
                ? ((u = this._video.videoWidth), (_ = this._video.videoHeight))
                : ((u = this._video.width), (_ = this._video.height)),
                _ > u && (_ = [u, (u = _)][0]),
                this._updateTransforms(e, t);
              let l = this._getFramebuffer(
                  a,
                  i.profile.dataWidth / 4,
                  i.profile.dataHeight
                ),
                f = this._getVertexBuffer(a),
                h = this._getIndexBuffer(a),
                d = this._getGreyscaleShader(a);
              a.bindFramebuffer(a.FRAMEBUFFER, l),
                a.viewport(
                  0,
                  0,
                  this._framebufferWidth,
                  this._framebufferHeight
                ),
                a.clearColor(0, 0, 0, 1),
                a.clear(a.COLOR_BUFFER_BIT),
                a.bindBuffer(a.ARRAY_BUFFER, f),
                a.vertexAttribPointer(
                  d.aVertexPositionLoc,
                  2,
                  a.FLOAT,
                  !1,
                  16,
                  0
                ),
                a.enableVertexAttribArray(d.aVertexPositionLoc),
                a.vertexAttribPointer(
                  d.aTextureCoordLoc,
                  2,
                  a.FLOAT,
                  !1,
                  16,
                  8
                ),
                a.enableVertexAttribArray(d.aTextureCoordLoc),
                a.bindBuffer(a.ELEMENT_ARRAY_BUFFER, h),
                a.useProgram(d.program),
                a.uniform1f(d.uTexWidthLoc, i.profile.dataWidth),
                a.uniformMatrix4fv(
                  d.uUvTransformLoc,
                  !1,
                  this._cameraUvTransform
                ),
                a.activeTexture(a.TEXTURE0),
                a.bindTexture(a.TEXTURE_2D, this._currentVideoTexture),
                a.uniform1i(d.uSamplerLoc, 0),
                a.drawElements(a.TRIANGLES, 6, a.UNSIGNED_SHORT, 0),
                a.disableVertexAttribArray(d.aVertexPositionLoc),
                a.disableVertexAttribArray(d.aTextureCoordLoc),
                a.bindFramebuffer(a.FRAMEBUFFER, null),
                a.bindBuffer(a.ARRAY_BUFFER, null),
                a.bindBuffer(a.ELEMENT_ARRAY_BUFFER, null),
                a.useProgram(null),
                a.bindTexture(a.TEXTURE_2D, null);
            }
            _readFrame(e, t) {
              if (!this._currentVideoTexture)
                throw new Error("No video texture");
              let r = this._currentVideoTexture;
              this._currentVideoTexture = void 0;
              let n = i.profile.dataWidth * i.profile.dataHeight,
                a = e.cameraPixelArrays.pop();
              for (; a && a.byteLength !== n; ) a = e.cameraPixelArrays.pop();
              a || (a = new ArrayBuffer(n));
              let s = new Uint8Array(a),
                o = this._getFramebuffer(
                  t,
                  i.profile.dataWidth / 4,
                  i.profile.dataHeight
                );
              return (
                t.bindFramebuffer(t.FRAMEBUFFER, o),
                t.readPixels(
                  0,
                  0,
                  this._framebufferWidth,
                  this._framebufferHeight,
                  t.RGBA,
                  t.UNSIGNED_BYTE,
                  s
                ),
                t.bindFramebuffer(t.FRAMEBUFFER, null),
                {
                  uvTransform: this._cameraUvTransform,
                  data: a,
                  texture: r,
                  dataWidth: i.profile.dataWidth,
                  dataHeight: i.profile.dataHeight,
                  userFacing: this._computedFrontCameraRotation,
                }
              );
            }
            _updateTransforms(e, t) {
              (e == this._computedTransformRotation &&
                t == this._computedFrontCameraRotation) ||
                ((this._computedTransformRotation = e),
                (this._computedFrontCameraRotation = t),
                (this._cameraUvTransform = this._getCameraUvTransform()),
                (this._cameraVertexTransform =
                  this._getCameraVertexTransform()));
            }
            _getCameraUvTransform() {
              switch (this._computedTransformRotation) {
                case 270:
                  return new Float32Array([
                    0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1,
                  ]);
                case 180:
                  return new Float32Array([
                    -1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1,
                  ]);
                case 90:
                  return new Float32Array([
                    0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1,
                  ]);
              }
              return new Float32Array([
                1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
              ]);
            }
            _getCameraVertexTransform() {
              let e = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
              if (!this._computedFrontCameraRotation) return e;
              switch (this._computedTransformRotation) {
                case 0:
                case 90:
                case 180:
                  e[0] = -1;
                  break;
                case 270:
                  e[5] = -1;
              }
              return e;
            }
            _getFramebuffer(e, t, r) {
              if (
                this._framebufferWidth === t &&
                this._framebufferHeight === r &&
                this._framebufferId
              )
                return this._framebufferId;
              if (
                (this._framebufferId &&
                  (e.deleteFramebuffer(this._framebufferId),
                  (this._framebufferId = null)),
                this._renderTexture &&
                  (e.deleteTexture(this._renderTexture),
                  (this._renderTexture = null)),
                (this._framebufferId = e.createFramebuffer()),
                !this._framebufferId)
              )
                throw new Error("Unable to create framebuffer");
              if (
                (e.bindFramebuffer(e.FRAMEBUFFER, this._framebufferId),
                (this._renderTexture = e.createTexture()),
                !this._renderTexture)
              )
                throw new Error("Unable to create render texture");
              e.activeTexture(e.TEXTURE0),
                e.bindTexture(e.TEXTURE_2D, this._renderTexture),
                e.texImage2D(
                  e.TEXTURE_2D,
                  0,
                  e.RGBA,
                  t,
                  r,
                  0,
                  e.RGBA,
                  e.UNSIGNED_BYTE,
                  null
                ),
                e.texParameteri(
                  e.TEXTURE_2D,
                  e.TEXTURE_WRAP_S,
                  e.CLAMP_TO_EDGE
                ),
                e.texParameteri(
                  e.TEXTURE_2D,
                  e.TEXTURE_WRAP_T,
                  e.CLAMP_TO_EDGE
                ),
                e.texParameterf(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR),
                e.framebufferTexture2D(
                  e.FRAMEBUFFER,
                  e.COLOR_ATTACHMENT0,
                  e.TEXTURE_2D,
                  this._renderTexture,
                  0
                );
              let n = e.checkFramebufferStatus(e.FRAMEBUFFER);
              if (n !== e.FRAMEBUFFER_COMPLETE)
                throw new Error("Framebuffer not complete: " + n.toString());
              return (
                (this._framebufferWidth = t),
                (this._framebufferHeight = r),
                e.bindTexture(e.TEXTURE_2D, null),
                e.bindFramebuffer(e.FRAMEBUFFER, null),
                this._framebufferId
              );
            }
            _getVertexBuffer(e) {
              if (this._vertexBuffer) return this._vertexBuffer;
              if (
                ((this._vertexBuffer = e.createBuffer()), !this._vertexBuffer)
              )
                throw new Error("Unable to create vertex buffer");
              e.bindBuffer(e.ARRAY_BUFFER, this._vertexBuffer);
              let t = new Float32Array([
                -1, -1, 0, 0, -1, 1, 0, 1, 1, 1, 1, 1, 1, -1, 1, 0,
              ]);
              return (
                e.bufferData(e.ARRAY_BUFFER, t, e.STATIC_DRAW),
                this._vertexBuffer
              );
            }
            _getIndexBuffer(e) {
              if (this._indexBuffer) return this._indexBuffer;
              if (((this._indexBuffer = e.createBuffer()), !this._indexBuffer))
                throw new Error("Unable to create index buffer");
              e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
              let t = new Uint16Array([0, 1, 2, 0, 2, 3]);
              return (
                e.bufferData(e.ELEMENT_ARRAY_BUFFER, t, e.STATIC_DRAW),
                this._indexBuffer
              );
            }
            _getGreyscaleShader(e) {
              if (this._greyscaleShader) return this._greyscaleShader;
              let t = e.createProgram();
              if (!t) throw new Error("Unable to create program");
              let r = s.compileShader(e, e.VERTEX_SHADER, f),
                n = s.compileShader(e, e.FRAGMENT_SHADER, h);
              e.attachShader(t, r), e.attachShader(t, n), s.linkProgram(e, t);
              let a = e.getUniformLocation(t, "uTexWidth");
              if (!a)
                throw new Error("Unable to get uniform location uTexWidth");
              let i = e.getUniformLocation(t, "uUvTransform");
              if (!i)
                throw new Error("Unable to get uniform location uUvTransform");
              let o = e.getUniformLocation(t, "uSampler");
              if (!o)
                throw new Error("Unable to get uniform location uSampler");
              return (
                (this._greyscaleShader = {
                  program: t,
                  aVertexPositionLoc: e.getAttribLocation(t, "aVertexPosition"),
                  aTextureCoordLoc: e.getAttribLocation(t, "aTextureCoord"),
                  uTexWidthLoc: a,
                  uUvTransformLoc: i,
                  uSamplerLoc: o,
                }),
                this._greyscaleShader
              );
            }
          }
          t.HTMLElementSource = l;
          let f =
              "\n    attribute vec4 aVertexPosition;\n    attribute vec2 aTextureCoord;\n\n    varying highp vec2 vTextureCoord1;\n    varying highp vec2 vTextureCoord2;\n    varying highp vec2 vTextureCoord3;\n    varying highp vec2 vTextureCoord4;\n\n    uniform float uTexWidth;\n\tuniform mat4 uUvTransform;\n\n    void main(void) {\n      highp vec2 offset1 = vec2(1.5 / uTexWidth, 0);\n      highp vec2 offset2 = vec2(0.5 / uTexWidth, 0);\n\n      gl_Position = aVertexPosition;\n      vTextureCoord1 = (uUvTransform * vec4(aTextureCoord - offset1, 0, 1)).xy;\n      vTextureCoord2 = (uUvTransform * vec4(aTextureCoord - offset2, 0, 1)).xy;\n      vTextureCoord3 = (uUvTransform * vec4(aTextureCoord + offset2, 0, 1)).xy;\n      vTextureCoord4 = (uUvTransform * vec4(aTextureCoord + offset1, 0, 1)).xy;\n    }\n",
            h =
              "\n  varying highp vec2 vTextureCoord1;\n  varying highp vec2 vTextureCoord2;\n  varying highp vec2 vTextureCoord3;\n  varying highp vec2 vTextureCoord4;\n\n  uniform sampler2D uSampler;\n\n  const lowp vec3 colorWeights = vec3(77.0 / 256.0, 150.0 / 256.0, 29.0 / 256.0);\n\n  void main(void) {\n    lowp vec4 outpx;\n\n    outpx.r = dot(colorWeights, texture2D(uSampler, vTextureCoord1).xyz);\n    outpx.g = dot(colorWeights, texture2D(uSampler, vTextureCoord2).xyz);\n    outpx.b = dot(colorWeights, texture2D(uSampler, vTextureCoord3).xyz);\n    outpx.a = dot(colorWeights, texture2D(uSampler, vTextureCoord4).xyz);\n\n    gl_FragColor = outpx;\n  }\n";
        },
        6127: (e, t, r) => {
          "use strict";
          if (
            (Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.log_level_t =
              t.instant_world_tracker_transform_orientation_t =
              t.face_landmark_name_t =
              t.barcode_format_t =
              t.initialize =
                void 0),
            document.currentScript)
          ) {
            const e = new URL(document.currentScript.src);
            let t = e.toString();
            if (e.pathname) {
              let e = t.split("/");
              e.pop(), (t = e.join("/") + "/");
            }
            r.p = t;
          }
          const n = r(6919),
            a = r(1965);
          t.initialize = function () {
            return console.log(`Zappar CV v${a.VERSION}`), n.initialize();
          };
          var i = r(1319);
          Object.defineProperty(t, "barcode_format_t", {
            enumerable: !0,
            get: function () {
              return i.barcode_format_t;
            },
          }),
            Object.defineProperty(t, "face_landmark_name_t", {
              enumerable: !0,
              get: function () {
                return i.face_landmark_name_t;
              },
            }),
            Object.defineProperty(
              t,
              "instant_world_tracker_transform_orientation_t",
              {
                enumerable: !0,
                get: function () {
                  return i.instant_world_tracker_transform_orientation_t;
                },
              }
            ),
            Object.defineProperty(t, "log_level_t", {
              enumerable: !0,
              get: function () {
                return i.log_level_t;
              },
            });
        },
        4446: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.zcwarn = t.zcerr = t.zcout = t.setLogLevel = void 0);
          const n = r(1319);
          let a = n.log_level_t.LOG_LEVEL_ERROR;
          (t.setLogLevel = function (e) {
            a = e;
          }),
            (t.zcout = function (...e) {
              a >= n.log_level_t.LOG_LEVEL_VERBOSE &&
                console.log("[Zappar] INFO", ...e);
            }),
            (t.zcerr = function (...e) {
              a >= n.log_level_t.LOG_LEVEL_ERROR &&
                console.error("[Zappar] ERROR", ...e);
            }),
            (t.zcwarn = function (...e) {
              a >= n.log_level_t.LOG_LEVEL_VERBOSE &&
                console.log("[Zappar] WARN", ...e);
            });
        },
        7123: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.MsgManager = void 0);
          const n = r(3435);
          t.MsgManager = class {
            constructor() {
              (this.onOutgoingMessage = new n.Event()),
                (this.onIncomingMessage = new n.Event1()),
                (this._outgoingMessages = []);
            }
            postIncomingMessage(e) {
              this.onIncomingMessage.emit(e);
            }
            postOutgoingMessage(e, t) {
              this._outgoingMessages.push({ msg: e, transferables: t }),
                this.onOutgoingMessage.emit();
            }
            getOutgoingMessages() {
              let e = this._outgoingMessages;
              return (this._outgoingMessages = []), e;
            }
          };
        },
        6919: function (e, t, r) {
          "use strict";
          var n =
            (this && this.__awaiter) ||
            function (e, t, r, n) {
              return new (r || (r = Promise))(function (a, i) {
                function s(e) {
                  try {
                    c(n.next(e));
                  } catch (e) {
                    i(e);
                  }
                }
                function o(e) {
                  try {
                    c(n.throw(e));
                  } catch (e) {
                    i(e);
                  }
                }
                function c(e) {
                  var t;
                  e.done
                    ? a(e.value)
                    : ((t = e.value),
                      t instanceof r
                        ? t
                        : new r(function (e) {
                            e(t);
                          })).then(s, o);
                }
                c((n = n.apply(e, t || [])).next());
              });
            };
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.initialize = void 0);
          const a = r(1823),
            i = r(9359),
            s = r(8491),
            o = r(887),
            c = r(2151),
            u = r(6868),
            _ = r(3115),
            l = r(9988),
            f = r(6842),
            h = r(5952),
            d = r(9599),
            p = r(7422),
            m = r(4446);
          let b;
          t.initialize = function () {
            if (b) return b;
            c.launchWorker();
            let e = new a.zappar_client((e) => {
              c.messageManager.postOutgoingMessage({ t: "zappar", d: e }, [e]);
            });
            if (
              window.location.hostname.toLowerCase().indexOf("github.com") > 0
            ) {
              let t = window.location.pathname.split("/");
              t.length > 1 &&
                t[1].length > 0 &&
                e.impl.analytics_project_id_set(".wiz" + t[1]);
            }
            return (
              c.messageManager.onIncomingMessage.bind((t) => {
                var r, n;
                switch (t.t) {
                  case "zappar":
                    null === (r = l.Pipeline.get(t.p)) ||
                      void 0 === r ||
                      r.pendingMessages.push(t.d);
                    break;
                  case "buf":
                    e.serializer.bufferReturn(t.d);
                    break;
                  case "cameraFrameRecycleS2C":
                    let a = t;
                    null === (n = l.Pipeline.get(a.p)) ||
                      void 0 === n ||
                      n.cameraTokenReturn(a.token, a.d);
                    break;
                  case "licerr": {
                    let e = document.createElement("div");
                    (e.innerHTML =
                      "Visit <a href='https://docs.zap.works/universal-ar/licensing/' style='color: white;'>our licensing page</a> to find out about hosting on your own domain."),
                      (e.style.position = "absolute"),
                      (e.style.bottom = "20px"),
                      (e.style.width = "80%"),
                      (e.style.backgroundColor = "black"),
                      (e.style.color = "white"),
                      (e.style.borderRadius = "10px"),
                      (e.style.padding = "10px"),
                      (e.style.fontFamily = "sans-serif"),
                      (e.style.textAlign = "center"),
                      (e.style.left = "10%"),
                      (e.style.zIndex = Number.MAX_SAFE_INTEGER.toString());
                    let t = document.createElement("span");
                    (t.innerText = " (30)"), e.append(t);
                    let r = 30;
                    setInterval(function () {
                      r--, r >= 0 && (t.innerText = " (" + r.toString() + ")");
                    }, 1e3),
                      document.body.append(e);
                  }
                }
              }),
              (b = Object.assign(Object.assign({}, e.impl), {
                camera_default_device_id: (e) =>
                  e
                    ? f.CameraSource.USER_DEFAULT_DEVICE_ID
                    : f.CameraSource.DEFAULT_DEVICE_ID,
                camera_source_create: (e, t) => f.CameraSource.create(e, t),
                camera_source_destroy: (e) => {
                  var t;
                  return null === (t = f.CameraSource.get(e)) || void 0 === t
                    ? void 0
                    : t.destroy();
                },
                camera_source_pause: (e) => {
                  var t;
                  return null === (t = f.CameraSource.get(e)) || void 0 === t
                    ? void 0
                    : t.pause();
                },
                camera_source_start: (e) => {
                  var t;
                  return null === (t = f.CameraSource.get(e)) || void 0 === t
                    ? void 0
                    : t.start();
                },
                pipeline_create: () =>
                  l.Pipeline.create(e.impl, c.messageManager),
                pipeline_frame_update: (t) => {
                  var r;
                  return null === (r = l.Pipeline.get(t)) || void 0 === r
                    ? void 0
                    : r.frameUpdate(e);
                },
                pipeline_camera_frame_draw_gl: (e, t, r, n) => {
                  var a;
                  null === (a = l.Pipeline.get(e)) ||
                    void 0 === a ||
                    a.cameraFrameDrawGL(t, r, n);
                },
                draw_plane: (e, t, r, n, a) => {
                  i.drawPlane(e, t, r, n, a);
                },
                pipeline_draw_face: (e, t, r, n, a) => {
                  var i;
                  let s = _.getFaceMesh(a);
                  if (!s)
                    return (
                      m.zcwarn(
                        "attempting to call draw_face on a destroyed zappar_face_mesh_t"
                      ),
                      new Uint16Array()
                    );
                  null === (i = l.Pipeline.get(e)) ||
                    void 0 === i ||
                    i.drawFace(t, r, n, s);
                },
                pipeline_draw_face_project: (e, t, r, n, a, i, s) => {
                  var o;
                  null === (o = l.Pipeline.get(e)) ||
                    void 0 === o ||
                    o.drawFaceProject(t, r, n, a, i, s);
                },
                projection_matrix_from_camera_model: s.projectionMatrix,
                pipeline_process_gl: (e) => {
                  var t;
                  return null === (t = l.Pipeline.get(e)) || void 0 === t
                    ? void 0
                    : t.processGL();
                },
                pipeline_gl_context_set: (e, t, r) => {
                  var n;
                  return null === (n = l.Pipeline.get(e)) || void 0 === n
                    ? void 0
                    : n.glContextSet(t, r);
                },
                pipeline_gl_context_lost: (e) => {
                  var t;
                  return null === (t = l.Pipeline.get(e)) || void 0 === t
                    ? void 0
                    : t.glContextLost();
                },
                pipeline_camera_frame_upload_gl: () => {},
                pipeline_camera_frame_texture_gl: (e) => {
                  var t;
                  return null === (t = l.Pipeline.get(e)) || void 0 === t
                    ? void 0
                    : t.cameraFrameTexture();
                },
                pipeline_camera_frame_texture_matrix: (e, t, r, n) => {
                  var a;
                  return (
                    (null === (a = l.Pipeline.get(e)) || void 0 === a
                      ? void 0
                      : a.cameraFrameTextureMatrix(t, r, n)) || o.mat4.create()
                  );
                },
                pipeline_camera_frame_user_facing: (e) => {
                  var t;
                  return (
                    (null === (t = l.Pipeline.get(e)) || void 0 === t
                      ? void 0
                      : t.cameraFrameUserFacing()) || !1
                  );
                },
                pipeline_camera_pose_default: () => o.mat4.create(),
                pipeline_camera_pose_with_attitude: (e, t) => {
                  var r;
                  return (
                    (null === (r = l.Pipeline.get(e)) || void 0 === r
                      ? void 0
                      : r.cameraPoseWithAttitude(t)) || o.mat4.create()
                  );
                },
                pipeline_camera_pose_with_origin: (e, t) => {
                  let r = o.mat4.create();
                  return o.mat4.invert(r, t), r;
                },
                instant_world_tracker_anchor_pose_camera_relative: (t, r) => {
                  let n = l.applyScreenCounterRotation(
                    void 0,
                    e.impl.instant_world_tracker_anchor_pose_raw(t)
                  );
                  if (r) {
                    let e = o.mat4.create();
                    o.mat4.fromScaling(e, [-1, 1, 1]),
                      o.mat4.multiply(n, e, n),
                      o.mat4.multiply(n, n, e);
                  }
                  return n;
                },
                instant_world_tracker_anchor_pose: (t, r, n) => {
                  let a = l.applyScreenCounterRotation(
                    void 0,
                    e.impl.instant_world_tracker_anchor_pose_raw(t)
                  );
                  if (n) {
                    let e = o.mat4.create();
                    o.mat4.fromScaling(e, [-1, 1, 1]),
                      o.mat4.multiply(a, e, a),
                      o.mat4.multiply(a, a, e);
                  }
                  return o.mat4.multiply(a, r, a), a;
                },
                image_tracker_anchor_pose_camera_relative: (t, r, n) => {
                  let a = l.applyScreenCounterRotation(
                    void 0,
                    e.impl.image_tracker_anchor_pose_raw(t, r)
                  );
                  if (n) {
                    let e = o.mat4.create();
                    o.mat4.fromScaling(e, [-1, 1, 1]),
                      o.mat4.multiply(a, e, a),
                      o.mat4.multiply(a, a, e);
                  }
                  return a;
                },
                image_tracker_anchor_pose: (t, r, n, a) => {
                  let i = l.applyScreenCounterRotation(
                    void 0,
                    e.impl.image_tracker_anchor_pose_raw(t, r)
                  );
                  if (a) {
                    let e = o.mat4.create();
                    o.mat4.fromScaling(e, [-1, 1, 1]),
                      o.mat4.multiply(i, e, i),
                      o.mat4.multiply(i, i, e);
                  }
                  return o.mat4.multiply(i, n, i), i;
                },
                face_tracker_anchor_pose_camera_relative: (t, r, n) => {
                  let a = l.applyScreenCounterRotation(
                    void 0,
                    e.impl.face_tracker_anchor_pose_raw(t, r)
                  );
                  if (n) {
                    let e = o.mat4.create();
                    o.mat4.fromScaling(e, [-1, 1, 1]),
                      o.mat4.multiply(a, e, a),
                      o.mat4.multiply(a, a, e);
                  }
                  return a;
                },
                face_tracker_anchor_pose: (t, r, n, a) => {
                  let i = l.applyScreenCounterRotation(
                    void 0,
                    e.impl.face_tracker_anchor_pose_raw(t, r)
                  );
                  if (a) {
                    let e = o.mat4.create();
                    o.mat4.fromScaling(e, [-1, 1, 1]),
                      o.mat4.multiply(i, e, i),
                      o.mat4.multiply(i, i, e);
                  }
                  return o.mat4.multiply(i, n, i), i;
                },
                face_tracker_model_load_default: (e) =>
                  n(this, void 0, void 0, function* () {
                    yield (function (e) {
                      return n(this, void 0, void 0, function* () {
                        let t = r(7006);
                        void 0 !== t.default && (t = t.default);
                        let n = yield fetch(t),
                          a = yield n.arrayBuffer();
                        null == b ||
                          b.face_tracker_model_load_from_memory(e, a);
                      });
                    })(e);
                  }),
                face_mesh_create: () => _.createFaceMesh(),
                face_mesh_destroy: (e) => {
                  _.destroyFaceMesh(e);
                },
                face_mesh_indices: (e) => {
                  let t = _.getFaceMesh(e);
                  return t
                    ? t.getIndices()
                    : (m.zcwarn(
                        "attempting to call face_mesh_indices on a destroyed zappar_face_mesh_t"
                      ),
                      new Uint16Array());
                },
                face_mesh_indices_size: (e) => {
                  let t = _.getFaceMesh(e);
                  return t
                    ? t.getIndices().length
                    : (m.zcwarn(
                        "attempting to call face_mesh_indices_size on a destroyed zappar_face_mesh_t"
                      ),
                      0);
                },
                face_mesh_uvs: (e) => {
                  let t = _.getFaceMesh(e);
                  return t
                    ? t.getUVs()
                    : (m.zcwarn(
                        "attempting to call face_mesh_uvs on a destroyed zappar_face_mesh_t"
                      ),
                      new Float32Array());
                },
                face_mesh_uvs_size: (e) => {
                  let t = _.getFaceMesh(e);
                  return t
                    ? t.getUVs().length
                    : (m.zcwarn(
                        "attempting to call face_mesh_uvs_size on a destroyed zappar_face_mesh_t"
                      ),
                      0);
                },
                face_mesh_vertices: (e) => {
                  let t = _.getFaceMesh(e);
                  return t
                    ? t.getVertices()
                    : (m.zcwarn(
                        "attempting to call face_mesh_vertices on a destroyed zappar_face_mesh_t"
                      ),
                      new Float32Array());
                },
                face_mesh_vertices_size: (e) => {
                  let t = _.getFaceMesh(e);
                  return t
                    ? t.getVertices().length
                    : (m.zcwarn(
                        "attempting to call face_mesh_vertices_size on a destroyed zappar_face_mesh_t"
                      ),
                      0);
                },
                face_mesh_normals: (e) => {
                  let t = _.getFaceMesh(e);
                  return t
                    ? t.getNormals()
                    : (m.zcwarn(
                        "attempting to call face_mesh_normals on a destroyed zappar_face_mesh_t"
                      ),
                      new Float32Array());
                },
                face_mesh_normals_size: (e) => {
                  let t = _.getFaceMesh(e);
                  return t
                    ? t.getNormals().length
                    : (m.zcwarn(
                        "attempting to call face_mesh_normals_size on a destroyed zappar_face_mesh_t"
                      ),
                      0);
                },
                face_mesh_load_from_memory: (e, t, r, n, a, i) => {
                  let s = _.getFaceMesh(e);
                  s
                    ? s.loadFromMemory(t, r, n, a, i)
                    : m.zcwarn(
                        "attempting to call face_mesh_load_from_memory on a destroyed zappar_face_mesh_t"
                      );
                },
                face_mesh_update: (e, t, r, n) => {
                  let a = _.getFaceMesh(e);
                  a
                    ? a.update(t, r, n)
                    : m.zcwarn(
                        "attempting to call face_mesh_update on a destroyed zappar_face_mesh_t"
                      );
                },
                face_mesh_load_default: (e) =>
                  n(this, void 0, void 0, function* () {
                    let t = _.getFaceMesh(e);
                    if (!t)
                      return void m.zcwarn(
                        "attempting to call face_mesh_load_default on a destroyed zappar_face_mesh_t"
                      );
                    let n = r(8333);
                    void 0 !== n.default && (n = n.default);
                    let a = yield fetch(n);
                    t.loadFromMemory(yield a.arrayBuffer(), !1, !1, !1, !1);
                  }),
                face_mesh_load_default_face: (e, t, a, i) =>
                  n(this, void 0, void 0, function* () {
                    let n = _.getFaceMesh(e);
                    if (!n)
                      return void m.zcwarn(
                        "attempting to call face_mesh_load_default_face on a destroyed zappar_face_mesh_t"
                      );
                    let s = r(8333);
                    void 0 !== s.default && (s = s.default);
                    let o = yield fetch(s);
                    n.loadFromMemory(yield o.arrayBuffer(), t, a, i, !1);
                  }),
                face_mesh_load_default_full_head_simplified: (e, t, a, i, s) =>
                  n(this, void 0, void 0, function* () {
                    let n = _.getFaceMesh(e);
                    if (!n)
                      return void m.zcwarn(
                        "attempting to call face_mesh_load_default_full_head_simplified on a destroyed zappar_face_mesh_t"
                      );
                    let o = r(7319);
                    void 0 !== o.default && (o = o.default);
                    let c = yield fetch(o);
                    n.loadFromMemory(yield c.arrayBuffer(), t, a, i, s);
                  }),
                face_mesh_loaded_version: (e) => {
                  let t = _.getFaceMesh(e);
                  return t
                    ? t.getModelVersion()
                    : (m.zcwarn(
                        "attempting to call face_mesh_load_default on a destroyed zappar_face_mesh_t"
                      ),
                      -1);
                },
                face_landmark_create: (e) => d.createFaceLandmark(e),
                face_landmark_destroy: (e) => {
                  d.destroyFaceLandmark(e);
                },
                face_landmark_update: (e, t, r, n) => {
                  let a = d.getFaceLandmark(e);
                  a
                    ? a.update(t, r, n)
                    : m.zcwarn(
                        "attempting to call face_landmark_update on a destroyed zappar_face_landmark_t"
                      );
                },
                face_landmark_anchor_pose: (e) => {
                  let t = d.getFaceLandmark(e);
                  return t
                    ? t.anchor_pose
                    : (m.zcwarn(
                        "attempting to call face_landmark_anchor_pose on a destroyed zappar_face_landmark_t"
                      ),
                      o.mat4.create());
                },
                html_element_source_create: (e, t) =>
                  h.HTMLElementSource.createVideoElementSource(e, t),
                html_element_source_start: (e) => {
                  var t;
                  return null ===
                    (t = h.HTMLElementSource.getVideoElementSource(e)) ||
                    void 0 === t
                    ? void 0
                    : t.start();
                },
                html_element_source_pause: (e) => {
                  var t;
                  return null ===
                    (t = h.HTMLElementSource.getVideoElementSource(e)) ||
                    void 0 === t
                    ? void 0
                    : t.pause();
                },
                html_element_source_destroy: (e) => {
                  var t;
                  return null ===
                    (t = h.HTMLElementSource.getVideoElementSource(e)) ||
                    void 0 === t
                    ? void 0
                    : t.destroy();
                },
                permission_granted_all: u.permissionGrantedAll,
                permission_granted_camera: u.permissionGrantedCamera,
                permission_granted_motion: u.permissionGrantedMotion,
                permission_denied_any: u.permissionDeniedAny,
                permission_denied_camera: u.permissionDeniedCamera,
                permission_denied_motion: u.permissionDeniedMotion,
                permission_request_motion: u.permissionRequestMotion,
                permission_request_camera: u.permissionRequestCamera,
                permission_request_all: u.permissionRequestAll,
                permission_request_ui: u.permissionRequestUI,
                permission_request_ui_promise: u.permissionRequestUI,
                permission_denied_ui: u.permissionDeniedUI,
                browser_incompatible: p.default.incompatible,
                browser_incompatible_ui: p.default.incompatible_ui,
                log_level_set: (t) => {
                  m.setLogLevel(t), e.impl.log_level_set(t);
                },
              })),
              b
            );
          };
        },
        6868: function (e, t, r) {
          "use strict";
          var n =
            (this && this.__awaiter) ||
            function (e, t, r, n) {
              return new (r || (r = Promise))(function (a, i) {
                function s(e) {
                  try {
                    c(n.next(e));
                  } catch (e) {
                    i(e);
                  }
                }
                function o(e) {
                  try {
                    c(n.throw(e));
                  } catch (e) {
                    i(e);
                  }
                }
                function c(e) {
                  var t;
                  e.done
                    ? a(e.value)
                    : ((t = e.value),
                      t instanceof r
                        ? t
                        : new r(function (e) {
                            e(t);
                          })).then(s, o);
                }
                c((n = n.apply(e, t || [])).next());
              });
            };
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.permissionDeniedUI =
              t.permissionRequestUI =
              t.permissionRequestMotion =
              t.permissionRequestCamera =
              t.permissionRequestAll =
              t.permissionGrantedAll =
              t.permissionDeniedAny =
              t.permissionDeniedMotion =
              t.permissionDeniedCamera =
              t.permissionGrantedMotion =
              t.permissionGrantedCamera =
                void 0);
          let a = new (r(2238).UAParser)(),
            i = !1,
            s = !1,
            o = !1,
            c = !1;
          function u() {
            return n(this, void 0, void 0, function* () {
              if (navigator.permissions && navigator.permissions.query)
                try {
                  let e = yield navigator.permissions.query({ name: "camera" });
                  (o = "denied" === e.state), (i = "granted" === e.state);
                } catch (e) {}
            });
          }
          function _() {
            return o || c;
          }
          function l() {
            return i && s;
          }
          function f() {
            return n(this, void 0, void 0, function* () {
              yield d(), yield h();
            });
          }
          function h() {
            return n(this, void 0, void 0, function* () {
              try {
                (yield navigator.mediaDevices.getUserMedia({ video: !0 }))
                  .getTracks()
                  .forEach((e) => e.stop()),
                  (i = !0),
                  (o = !1);
              } catch (e) {
                (i = !1), (o = !0);
              }
            });
          }
          function d() {
            return n(this, void 0, void 0, function* () {
              if (
                window.DeviceOrientationEvent &&
                window.DeviceOrientationEvent.requestPermission &&
                "granted" !==
                  (yield window.DeviceOrientationEvent.requestPermission())
              )
                return (s = !1), (c = !0), !1;
              (s = !0), (c = !1);
            });
          }
          (window.DeviceOrientationEvent &&
            window.DeviceOrientationEvent.requestPermission) ||
            (s = !0),
            u(),
            (t.permissionGrantedCamera = function () {
              return i;
            }),
            (t.permissionGrantedMotion = function () {
              return s;
            }),
            (t.permissionDeniedCamera = function () {
              return o;
            }),
            (t.permissionDeniedMotion = function () {
              return c;
            }),
            (t.permissionDeniedAny = _),
            (t.permissionGrantedAll = l),
            (t.permissionRequestAll = f),
            (t.permissionRequestCamera = h),
            (t.permissionRequestMotion = d),
            (t.permissionRequestUI = function () {
              return n(this, void 0, void 0, function* () {
                if ((yield u(), l())) return !0;
                let e = document.createElement("div");
                e.classList.add("zappar-permission-request"),
                  (e.innerHTML =
                    '\n    <style>\n        .zappar-permission-request {\n            position: fixed;\n            width: 100%;\n            height: 100%;\n            top: 0px;\n            left: 0px;\n            z-index: 1000;\n            background-color: rgba(0, 0, 0, 0.9);\n            font-family: sans-serif;\n            color: white;\n            display: flex;\n            flex-direction: column;\n            align-items: center;\n            justify-content: center;\n        }\n        .zappar-inner {\n            max-width: 400px;\n            text-align: center;\n        }\n        .zappar-title {\n            font-size: 20px;\n        }\n        .zappar-text {\n            font-size: 14px;\n            padding: 15px;\n        }\n        .zappar-inner > button {\n            background: none;\n            outline: none;\n            border: 2px solid white;\n            border-radius: 10px;\n            color: white;\n            padding: 10px 40px;\n            text-transform: uppercase;\n        }\n    </style>\n    <div class="zappar-inner">\n        <div class="zappar-title">Almost there...</div>\n        <div class="zappar-text">In order to provide this augmented reality experience, we need access to your device\'s camera and motion sensors.</div>\n        <button id="zappar-permission-request-button">Grant Access</button>\n    </div>\n'),
                  document.body.append(e);
                let t = e.querySelector("#zappar-permission-request-button");
                return yield new Promise((r) => {
                  null == t ||
                    t.addEventListener("click", () =>
                      n(this, void 0, void 0, function* () {
                        for (yield f(), e.remove(); ; ) {
                          if (
                            (yield new Promise((e) =>
                              requestAnimationFrame(() => e())
                            ),
                            _())
                          )
                            return void r(!1);
                          if (l()) return void r(!0);
                        }
                      })
                    );
                });
              });
            }),
            (t.permissionDeniedUI = function () {
              switch (a.getBrowser().name) {
                case "Chrome":
                  !(function () {
                    let e = document.createElement("div");
                    e.classList.add("zappar-permission-request"),
                      (e.innerHTML =
                        '\n    <style>\n        .zappar-permission-request {\n            position: fixed;\n            width: 100%;\n            height: 100%;\n            top: 0px;\n            left: 0px;\n            z-index: 1000;\n            background-color: rgba(0, 0, 0, 0.9);\n            font-family: sans-serif;\n            color: white;\n            display: flex;\n            flex-direction: column;\n            align-items: center;\n            justify-content: center;\n        }\n        .zappar-inner {\n            width: 400px;\n            text-align: center;\n        }\n        .zappar-title {\n            font-size: 20px;\n        }\n        .zappar-text {\n            font-size: 14px;\n            padding: 15px;\n        }\n        .zappar-inner > button {\n            background: none;\n            outline: none;\n            border: 2px solid white;\n            border-radius: 10px;\n            color: white;\n            padding: 10px 40px;\n            text-transform: uppercase;\n        }\n    </style>\n    <div class="zappar-inner">\n        <div class="zappar-title">Permission is Needed</div>\n        <div class="zappar-text">Permission to access your device\'s camera and motion sensors is necessary for this experience.<br/><br/>To grant access, please tap the ! button in the address bar of your browser, then "Site settings", and finally "Clear and reset". You can then reload the page to try again.</div>\n        <button id="zappar-permission-reload-button">Reload</button>\n    </div>\n'),
                      document.body.append(e);
                    let t = e.querySelector("#zappar-permission-reload-button");
                    null == t ||
                      t.addEventListener("click", () =>
                        window.location.reload()
                      );
                  })();
                  break;
                default:
                  !(function () {
                    let e = document.createElement("div");
                    e.classList.add("zappar-permission-request"),
                      (e.innerHTML =
                        '\n    <style>\n        .zappar-permission-request {\n            position: fixed;\n            width: 100%;\n            height: 100%;\n            top: 0px;\n            left: 0px;\n            z-index: 1000;\n            background-color: rgba(0, 0, 0, 0.9);\n            font-family: sans-serif;\n            color: white;\n            display: flex;\n            flex-direction: column;\n            align-items: center;\n            justify-content: center;\n        }\n        .zappar-inner {\n            max-width: 400px;\n            text-align: center;\n        }\n        .zappar-title {\n            font-size: 20px;\n        }\n        .zappar-text {\n            font-size: 14px;\n            padding: 15px;\n        }\n        .zappar-inner > button {\n            background: none;\n            outline: none;\n            border: 2px solid white;\n            border-radius: 10px;\n            color: white;\n            padding: 10px 40px;\n            text-transform: uppercase;\n        }\n    </style>\n    <div class="zappar-inner">\n        <div class="zappar-title">Permission is Needed</div>\n        <div class="zappar-text">Permission to access your device\'s camera and motion sensors is necessary for this experience. Please reload the page to try again.</div>\n        <button id="zappar-permission-reload-button">Reload</button>\n    </div>\n'),
                      document.body.append(e);
                    let t = e.querySelector("#zappar-permission-reload-button");
                    null == t ||
                      t.addEventListener("click", () =>
                        window.location.reload()
                      );
                  })();
              }
            });
        },
        9988: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.applyScreenCounterRotation = t.Pipeline = void 0);
          const n = r(8543),
            a = r(887),
            i = r(8491),
            s = r(8258),
            o = r(4203),
            c = r(9359),
            u = r(3435),
            _ = r(4446);
          let l = new Map();
          class f {
            constructor(e, t, r) {
              (this._client = e),
                (this._impl = t),
                (this._mgr = r),
                (this.pendingMessages = []),
                (this.cameraTokens = new Map()),
                (this.nextCameraToken = 1),
                (this.tokensInFlight = 0),
                (this.videoTextures = []),
                (this.cameraPixelArrays = []),
                (this.onGLContextReset = new u.Event());
            }
            static create(e, t) {
              let r = e.pipeline_create();
              return l.set(r, new f(e, r, t)), r;
            }
            static get(e) {
              return l.get(e);
            }
            frameUpdate(e) {
              for (let t of this.pendingMessages)
                e.processMessages(t),
                  this._mgr.postOutgoingMessage(
                    { t: "buf", p: this._impl, d: t },
                    [t]
                  );
              this.pendingMessages = [];
              let t = this._client.pipeline_camera_frame_user_data(this._impl);
              if (t)
                for (let e of this.cameraTokens)
                  e[0] < t &&
                    (e[1].texture && this.videoTextures.push(e[1].texture),
                    this.cameraTokens.delete(e[0]));
            }
            cameraTokenReturn(e, t) {
              this.cameraPixelArrays.push(t), this.tokensInFlight--;
            }
            getVideoTexture() {
              return this.videoTextures.pop();
            }
            destroy() {
              this._client.pipeline_destroy(this._impl), l.delete(this._impl);
            }
            getCurrentCameraInfo() {
              let e = this._client.pipeline_camera_frame_user_data(this._impl);
              if (e) return this.cameraTokens.get(e);
            }
            cameraFrameDrawGL(e, t, r) {
              if (!this.glContext) return;
              let a = this.getCurrentCameraInfo();
              a &&
                (this._cameraDraw ||
                  (this._cameraDraw = new n.CameraDraw(this.glContext)),
                this._cameraDraw.drawCameraFrame(e, t, a, !0 === r));
            }
            glContextLost() {
              this._cameraDraw && this._cameraDraw.dispose(),
                this._faceDraw && this._faceDraw.dispose(),
                this._faceProjectDraw && this._faceProjectDraw.dispose(),
                delete this._cameraDraw,
                delete this._faceDraw,
                delete this._faceProjectDraw,
                c.disposeDrawPlane(),
                this.onGLContextReset.emit();
              for (let e of this.videoTextures)
                this.glContext && this.glContext.deleteTexture(e);
              this.videoTextures = [];
              for (let e of this.cameraTokens)
                this.glContext &&
                  e[1].texture &&
                  this.glContext.deleteTexture(e[1].texture),
                  (e[1].texture = void 0);
              this.glContext = void 0;
            }
            glContextSet(e, t) {
              this.glContextLost(), (this.glContext = e), (t = t || []);
              for (let r = 0; r < 4; r++) {
                let n = t[r] || e.createTexture();
                n &&
                  (e.bindTexture(e.TEXTURE_2D, n),
                  e.texParameteri(
                    e.TEXTURE_2D,
                    e.TEXTURE_WRAP_S,
                    e.CLAMP_TO_EDGE
                  ),
                  e.texParameteri(
                    e.TEXTURE_2D,
                    e.TEXTURE_WRAP_T,
                    e.CLAMP_TO_EDGE
                  ),
                  e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR),
                  this.videoTextures.push(n));
              }
              e.bindTexture(e.TEXTURE_2D, null);
            }
            drawFace(e, t, r, n) {
              if (!this.glContext) return;
              this._faceDraw ||
                (this._faceDraw = new s.FaceDraw(this.glContext));
              let i = a.mat4.create();
              a.mat4.multiply(i, e, t),
                a.mat4.multiply(i, i, r),
                this._faceDraw.drawFace(i, n);
            }
            drawFaceProject(e, t, r, n, a, i) {
              this.glContext &&
                (this._faceProjectDraw ||
                  (this._faceProjectDraw = new o.FaceDrawProject(
                    this.glContext
                  )),
                this._faceProjectDraw.drawFace(e, t, r, n, a, i));
            }
            cameraFrameTexture() {
              var e;
              return null === (e = this.getCurrentCameraInfo()) || void 0 === e
                ? void 0
                : e.texture;
            }
            cameraFrameTextureMatrix(e, t, r) {
              let i = this.getCurrentCameraInfo();
              return i
                ? n.cameraFrameTextureMatrix(
                    i.dataWidth,
                    i.dataHeight,
                    e,
                    t,
                    i.uvTransform,
                    r
                  )
                : a.mat4.create();
            }
            cameraFrameUserFacing() {
              var e;
              return (
                (null === (e = this.getCurrentCameraInfo()) || void 0 === e
                  ? void 0
                  : e.userFacing) || !1
              );
            }
            cameraPoseWithAttitude(e) {
              let t = h(
                this.getCurrentCameraInfo(),
                this._client.pipeline_camera_frame_camera_attitude(this._impl)
              );
              if (e) {
                let e = a.mat4.create();
                a.mat4.fromScaling(e, [-1, 1, 1]),
                  a.mat4.multiply(t, e, t),
                  a.mat4.multiply(t, t, e);
              }
              return a.mat4.invert(t, t), t;
            }
            processGL() {
              if (!this.glContext)
                return void _.zcerr(
                  "no GL context for camera frames - please call pipeline_gl_context_set"
                );
              if (!this.currentCameraSource) return;
              if (this.tokensInFlight > 0)
                return void this.currentCameraSource.getFrame(!0);
              let e = this.currentCameraSource.getFrame(!1);
              if (!e) return;
              let t = this.nextCameraToken++;
              this.cameraTokens.set(t, e);
              let r = {
                d: e.data,
                p: this._impl,
                width: e.dataWidth,
                height: e.dataHeight,
                token: t,
                userFacing: e.userFacing,
                t: "cameraFrameC2S",
              };
              this.tokensInFlight++, this._mgr.postOutgoingMessage(r, [e.data]);
            }
            motionAccelerometerSubmit(e, t, r, n) {
              this._client.pipeline_motion_accelerometer_submit(
                this._impl,
                e,
                t,
                r,
                n
              );
            }
            motionRotationRateSubmit(e, t, r, n) {
              this._client.pipeline_motion_rotation_rate_submit(
                this._impl,
                e,
                t,
                r,
                n
              );
            }
            motionAttitudeSubmit(e, t, r, n) {
              this._client.pipeline_motion_attitude_submit(
                this._impl,
                e,
                t,
                r,
                n
              );
            }
          }
          function h(e, t) {
            let r = !1;
            r = !!e && e.userFacing;
            let n = a.mat4.create();
            return (
              a.mat4.fromRotation(
                n,
                (i.cameraRotationForScreenOrientation(r) * Math.PI) / 180,
                [0, 0, 1]
              ),
              a.mat4.multiply(n, n, t),
              n
            );
          }
          (t.Pipeline = f), (t.applyScreenCounterRotation = h);
        },
        1120: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.profile = t.EmbeddedVideoImplementation = void 0);
          const n = r(2238);
          var a;
          ((a =
            t.EmbeddedVideoImplementation ||
            (t.EmbeddedVideoImplementation = {}))[(a.OBJECT_URL = 0)] =
            "OBJECT_URL"),
            (a[(a.SRC_OBJECT = 1)] = "SRC_OBJECT"),
            (t.profile = {
              deviceMotionMutliplier: -1,
              blacklisted: !1,
              showGyroPermissionsWarningIfNecessary: !1,
              showSafariPermissionsResetIfNecessary: !1,
              requestHighFrameRate: !1,
              videoWidth: 640,
              videoHeight: 480,
              dataWidth: 320,
              dataHeight: 240,
              videoElementInDOM: !1,
            }),
            (window.zeeProfile = t.profile);
          let i = new n.UAParser();
          switch (i.getBrowser().name) {
            case "Safari":
              if (
                ((t.profile.deviceMotionMutliplier = 1),
                void 0 === window.orientation)
              )
                break;
              (t.profile.videoElementInDOM = !0),
                (t.profile.showSafariPermissionsResetIfNecessary = !0);
              break;
            case "Chrome":
              let e = i.getEngine();
              if (!e || "WebKit" !== e.name) break;
            case "Mobile Safari":
              t.profile.deviceMotionMutliplier = 1;
              let r = i.getOS().version;
              if (r) {
                let e = r.split(".");
                if (e.length >= 2) {
                  const r = parseInt(e[0]),
                    n = parseInt(e[1]);
                  (r < 11 || (11 === r && n < 3)) &&
                    (t.profile.blacklisted = !0),
                    (r < 12 || (12 === r && n < 2)) &&
                      (t.profile.videoElementInDOM = !0),
                    ((12 === r && n >= 2) || r >= 13) &&
                      (t.profile.showGyroPermissionsWarningIfNecessary = !0),
                    r >= 13 &&
                      (t.profile.showSafariPermissionsResetIfNecessary = !0),
                    ((r >= 12 && n > 1) || r >= 13) &&
                      navigator.mediaDevices &&
                      navigator.mediaDevices.getSupportedConstraints &&
                      navigator.mediaDevices.getSupportedConstraints()
                        .frameRate &&
                      ((t.profile.requestHighFrameRate = !0),
                      (t.profile.videoHeight = 360),
                      (t.profile.dataHeight = 180));
                }
              }
          }
        },
        7476: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.MessageSerializer = void 0),
            (t.MessageSerializer = class {
              constructor(e) {
                (this._messageSender = e),
                  (this._freeBufferPool = []),
                  (this._buffer = new ArrayBuffer(16)),
                  (this._i32View = new Int32Array(this._buffer)),
                  (this._f32View = new Float32Array(this._buffer)),
                  (this._f64View = new Float64Array(this._buffer)),
                  (this._u8View = new Uint8Array(this._buffer)),
                  (this._u8cView = new Uint8ClampedArray(this._buffer)),
                  (this._u16View = new Uint16Array(this._buffer)),
                  (this._u32View = new Uint32Array(this._buffer)),
                  (this._offset = 1),
                  (this._startOffset = -1),
                  (this._timeoutSet = !1),
                  (this._appender = {
                    int: (e) => this.int(e),
                    bool: (e) => this.int(e ? 1 : 0),
                    float: (e) => this.float(e),
                    string: (e) => this.string(e),
                    dataWithLength: (e) => this.arrayBuffer(e),
                    type: (e) => this.int(e),
                    matrix4x4: (e) => this.float32ArrayBuffer(e),
                    identityCoefficients: (e) => this.float32ArrayBuffer(e),
                    expressionCoefficients: (e) => this.float32ArrayBuffer(e),
                    cameraModel: (e) => this.float32ArrayBuffer(e),
                    timestamp: (e) => this.double(e),
                    barcodeFormat: (e) => this.int(e),
                    faceLandmarkName: (e) => this.int(e),
                    instantTrackerTransformOrientation: (e) => this.int(e),
                    logLevel: (e) => this.int(e),
                  }),
                  this._freeBufferPool.push(new ArrayBuffer(16)),
                  this._freeBufferPool.push(new ArrayBuffer(16));
              }
              bufferReturn(e) {
                this._freeBufferPool.push(e);
              }
              _ensureArrayBuffer(e) {
                let t,
                  r = 4 * (this._offset + e + 8);
                if (this._buffer && this._buffer.byteLength >= r) return;
                if (!t) {
                  let e = r;
                  e--,
                    (e |= e >> 1),
                    (e |= e >> 2),
                    (e |= e >> 4),
                    (e |= e >> 8),
                    (e |= e >> 16),
                    e++,
                    (t = new ArrayBuffer(e));
                }
                let n = this._buffer ? this._i32View : void 0;
                (this._buffer = t),
                  (this._i32View = new Int32Array(this._buffer)),
                  (this._f32View = new Float32Array(this._buffer)),
                  (this._f64View = new Float64Array(this._buffer)),
                  (this._u8View = new Uint8Array(this._buffer)),
                  (this._u8cView = new Uint8ClampedArray(this._buffer)),
                  (this._u16View = new Uint16Array(this._buffer)),
                  (this._u32View = new Uint32Array(this._buffer)),
                  n && this._i32View.set(n.subarray(0, this._offset));
              }
              sendMessage(e, t) {
                this._ensureArrayBuffer(4),
                  (this._startOffset = this._offset),
                  (this._i32View[this._offset + 1] = e),
                  (this._offset += 2),
                  t(this._appender),
                  (this._i32View[this._startOffset] =
                    this._offset - this._startOffset),
                  (this._startOffset = -1),
                  this._sendOneTime();
              }
              _sendOneTime() {
                !1 === this._timeoutSet &&
                  ((this._timeoutSet = !0),
                  setTimeout(() => {
                    (this._timeoutSet = !1), this._send();
                  }, 0));
              }
              _send() {
                0 !== this._freeBufferPool.length
                  ? ((this._i32View[0] = this._offset),
                    this._messageSender(this._buffer),
                    (this._buffer = void 0),
                    (this._buffer = this._freeBufferPool.pop()),
                    (this._i32View = new Int32Array(this._buffer)),
                    (this._f32View = new Float32Array(this._buffer)),
                    (this._f64View = new Float64Array(this._buffer)),
                    (this._u8View = new Uint8Array(this._buffer)),
                    (this._u8cView = new Uint8ClampedArray(this._buffer)),
                    (this._u16View = new Uint16Array(this._buffer)),
                    (this._u32View = new Uint32Array(this._buffer)),
                    (this._offset = 1),
                    (this._startOffset = -1))
                  : this._sendOneTime();
              }
              int(e) {
                this._ensureArrayBuffer(1),
                  (this._i32View[this._offset] = e),
                  this._offset++;
              }
              double(e) {
                this._ensureArrayBuffer(2),
                  this._offset % 2 == 1 && this._offset++,
                  (this._f64View[this._offset / 2] = e),
                  (this._offset += 2);
              }
              float(e) {
                this._ensureArrayBuffer(1),
                  (this._f32View[this._offset] = e),
                  this._offset++;
              }
              int32Array(e) {
                this._ensureArrayBuffer(e.length);
                for (let t = 0; t < e.length; ++t)
                  this._i32View[this._offset + t] = e[t];
                this._offset += e.length;
              }
              float32Array(e) {
                this._ensureArrayBuffer(e.length);
                for (let t = 0; t < e.length; ++t)
                  this._f32View[this._offset + t] = e[t];
                this._offset += e.length;
              }
              booleanArray(e) {
                this._ensureArrayBuffer(e.length);
                for (let t = 0; t < e.length; ++t)
                  this._i32View[this._offset + t] = e[t] ? 1 : 0;
                this._offset += e.length;
              }
              uint8ArrayBuffer(e) {
                this._ensureArrayBuffer(e.byteLength / 4),
                  (this._i32View[this._offset] = e.byteLength),
                  this._offset++,
                  this._u8View.set(e, 4 * this._offset),
                  (this._offset += e.byteLength >> 2),
                  0 != (3 & e.byteLength) && this._offset++;
              }
              arrayBuffer(e) {
                let t = new Uint8Array(e);
                this.uint8ArrayBuffer(t);
              }
              uint8ClampedArrayBuffer(e) {
                this._ensureArrayBuffer(e.byteLength / 4),
                  (this._i32View[this._offset] = e.byteLength),
                  this._offset++,
                  this._u8cView.set(e, 4 * this._offset),
                  (this._offset += e.byteLength >> 2),
                  0 != (3 & e.byteLength) && this._offset++;
              }
              float32ArrayBuffer(e) {
                this._ensureArrayBuffer(e.byteLength / 4),
                  (this._i32View[this._offset] = e.length),
                  this._offset++,
                  this._f32View.set(e, this._offset),
                  (this._offset += e.length);
              }
              uint16ArrayBuffer(e) {
                this._ensureArrayBuffer(e.byteLength / 4),
                  (this._i32View[this._offset] = e.length),
                  this._offset++;
                let t = 2 * this._offset;
                this._u16View.set(e, t),
                  (this._offset += e.length >> 1),
                  0 != (1 & e.length) && this._offset++;
              }
              int32ArrayBuffer(e) {
                this._ensureArrayBuffer(e.byteLength / 4),
                  (this._i32View[this._offset] = e.length),
                  this._offset++,
                  this._i32View.set(e, this._offset),
                  (this._offset += e.length);
              }
              uint32ArrayBuffer(e) {
                this._ensureArrayBuffer(e.byteLength / 4),
                  (this._i32View[this._offset] = e.length),
                  this._offset++,
                  this._u32View.set(e, this._offset),
                  (this._offset += e.length);
              }
              string(e) {
                let t = new TextEncoder().encode(e);
                this._ensureArrayBuffer(t.byteLength / 4),
                  (this._i32View[this._offset] = t.byteLength),
                  this._offset++,
                  this._u8View.set(t, 4 * this._offset),
                  (this._offset += t.byteLength >> 2),
                  0 != (3 & t.byteLength) && this._offset++;
              }
            });
        },
        9705: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.linkProgram = t.compileShader = void 0),
            (t.compileShader = function (e, t, r) {
              let n = e.createShader(t);
              if (!n) throw new Error("Unable to create shader");
              e.shaderSource(n, r), e.compileShader(n);
              let a = e.getShaderInfoLog(n);
              if (a && a.trim().length > 0)
                throw new Error("Shader compile error: " + a);
              return n;
            }),
            (t.linkProgram = function (e, t) {
              e.linkProgram(t);
              let r = e.getProgramInfoLog(t);
              if (r && r.trim().length > 0)
                throw new Error("Unable to link: " + r);
            });
        },
        846: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.Source = void 0),
            (t.Source = class {});
        },
        1965: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.VERSION = void 0),
            (t.VERSION = "0.3.8");
        },
        2151: function (e, t, r) {
          "use strict";
          var n =
            (this && this.__awaiter) ||
            function (e, t, r, n) {
              return new (r || (r = Promise))(function (a, i) {
                function s(e) {
                  try {
                    c(n.next(e));
                  } catch (e) {
                    i(e);
                  }
                }
                function o(e) {
                  try {
                    c(n.throw(e));
                  } catch (e) {
                    i(e);
                  }
                }
                function c(e) {
                  var t;
                  e.done
                    ? a(e.value)
                    : ((t = e.value),
                      t instanceof r
                        ? t
                        : new r(function (e) {
                            e(t);
                          })).then(s, o);
                }
                c((n = n.apply(e, t || [])).next());
              });
            };
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.launchWorker = t.messageManager = void 0);
          const a = r(7123);
          let i;
          (t.messageManager = new a.MsgManager()),
            (i = r(9615)),
            i.default && (i = i.default),
            (t.launchWorker = function () {
              return n(this, void 0, void 0, function* () {
                let e = new i();
                var n;
                function a() {
                  let r = t.messageManager.getOutgoingMessages();
                  for (let t of r) e.postMessage(t.msg, t.transferables);
                }
                e.postMessage({ t: "wasm", url: r(9740).Z }),
                  yield ((n = e),
                  new Promise((e) => {
                    let t = (r) => {
                      "loaded" === r.data &&
                        (n.removeEventListener("message", t), e());
                    };
                    n.addEventListener("message", t);
                  })),
                  t.messageManager.onOutgoingMessage.bind(a),
                  a(),
                  e.addEventListener("message", (e) => {
                    t.messageManager.postIncomingMessage(e.data);
                  });
              });
            });
        },
        4823: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.Camera = t.CameraMirrorMode = t.CameraPoseMode = void 0);
          const n = r(445),
            a = r(4772),
            i = r(6750);
          var s, o;
          !(function (e) {
            (e[(e.Default = 0)] = "Default"),
              (e[(e.Attitude = 1)] = "Attitude"),
              (e[(e.AnchorOrigin = 2)] = "AnchorOrigin");
          })((s = t.CameraPoseMode || (t.CameraPoseMode = {}))),
            (function (e) {
              (e[(e.None = 0)] = "None"),
                (e[(e.Poses = 1)] = "Poses"),
                (e[(e.CSS = 2)] = "CSS");
            })((o = t.CameraMirrorMode || (t.CameraMirrorMode = {})));
          class c extends n.THREE.Camera {
            constructor(e) {
              super(),
                (this.backgroundTexture = new n.THREE.Texture()),
                (this.poseMode = s.Default),
                (this.rearCameraMirrorMode = o.None),
                (this.userCameraMirrorMode = o.Poses),
                (this._currentMirrorMode = o.None),
                (this.isPerspectiveCamera = !0),
                (this._cameraRunningRear = null),
                (this._hasSetCSSScaleX = !1),
                (this._emptyScene = new n.THREE.Scene()),
                (this._emptyTarget = new n.THREE.WebGLRenderTarget(2, 2)),
                (this.pipeline =
                  e instanceof a.Pipeline
                    ? e
                    : (null == e ? void 0 : e.pipeline) ||
                      i.getDefaultPipeline()),
                (this.rawPose = this.pipeline.cameraPoseDefault()),
                e instanceof a.Pipeline
                  ? ((this.rearCameraSource = new i.CameraSource(
                      a.cameraDefaultDeviceID(),
                      this.pipeline
                    )),
                    (this.userCameraSource = new i.CameraSource(
                      a.cameraDefaultDeviceID(!0),
                      this.pipeline
                    )))
                  : ((this.rearCameraSource =
                      "string" ==
                      typeof (null == e ? void 0 : e.rearCameraSource)
                        ? new i.CameraSource(e.rearCameraSource, this.pipeline)
                        : (null == e ? void 0 : e.rearCameraSource) ||
                          new i.CameraSource(
                            a.cameraDefaultDeviceID(),
                            this.pipeline
                          )),
                    (this.userCameraSource =
                      "string" ==
                      typeof (null == e ? void 0 : e.userCameraSource)
                        ? new i.CameraSource(e.userCameraSource, this.pipeline)
                        : (null == e ? void 0 : e.userCameraSource) ||
                          new i.CameraSource(
                            a.cameraDefaultDeviceID(!0),
                            this.pipeline
                          ))),
                (this.matrixAutoUpdate = !1),
                document.addEventListener("visibilitychange", () => {
                  "visible" == document.visibilityState
                    ? this._resume()
                    : this._pause();
                });
              const t = new n.THREE.ImmediateRenderObject(
                new n.THREE.MeshBasicMaterial()
              );
              this._emptyScene.add(t);
            }
            _pause() {
              this.userCameraSource.pause(), this.rearCameraSource.pause();
            }
            _resume() {
              null !== this._cameraRunningRear &&
                (this._cameraRunningRear
                  ? this.rearCameraSource.start()
                  : this.userCameraSource.start());
            }
            start(e) {
              e ? this.userCameraSource.start() : this.rearCameraSource.start(),
                (this._cameraRunningRear = !e);
            }
            setPoseModeAnchorOrigin(e) {
              (this.poseAnchorOrigin = e), (this.poseMode = s.AnchorOrigin);
            }
            get currentMirrorMode() {
              return this._currentMirrorMode;
            }
            updateFrame(e) {
              const t = e.getRenderTarget();
              e.setRenderTarget(this._emptyTarget),
                e.render(this._emptyScene, this),
                e.state.reset(),
                this.pipeline.processGL(),
                e.state.reset(),
                e.setRenderTarget(t),
                this.pipeline.frameUpdate(),
                (this._currentMirrorMode = this.pipeline.cameraFrameUserFacing()
                  ? this.userCameraMirrorMode
                  : this.rearCameraMirrorMode),
                this._currentMirrorMode !== o.CSS && this._hasSetCSSScaleX
                  ? ((e.domElement.style.transform = ""),
                    (this._hasSetCSSScaleX = !1))
                  : this._currentMirrorMode !== o.CSS ||
                    this._hasSetCSSScaleX ||
                    ((e.domElement.style.transform = "scaleX(-1)"),
                    (this._hasSetCSSScaleX = !0));
              const r = this.pipeline.cameraModel(),
                n = a.projectionMatrixFromCameraModel(
                  r,
                  e.domElement.width,
                  e.domElement.height
                );
              switch (
                (this.projectionMatrix.fromArray(n),
                "function" == typeof this.projectionMatrixInverse.invert
                  ? this.projectionMatrixInverse
                      .copy(this.projectionMatrix)
                      .invert()
                  : this.projectionMatrix.getInverse(this.projectionMatrix),
                this.poseMode)
              ) {
                case s.Default:
                  this.rawPose = this.pipeline.cameraPoseDefault();
                  break;
                case s.Attitude:
                  this.rawPose = this.pipeline.cameraPoseWithAttitude(
                    this._currentMirrorMode === o.Poses
                  );
                  break;
                case s.AnchorOrigin:
                  this.rawPose = this.poseAnchorOrigin
                    ? this._getOriginPose()
                    : this.pipeline.cameraPoseDefault();
              }
              this._updateBackgroundTexture(e);
            }
            updateMatrixWorld(e) {
              this.matrix.fromArray(this.rawPose), super.updateMatrixWorld(e);
            }
            _getOriginPose() {
              return this.poseAnchorOrigin
                ? this.pipeline.cameraPoseWithOrigin(
                    this.poseAnchorOrigin.poseCameraRelative(
                      this._currentMirrorMode === o.Poses
                    )
                  )
                : this.pipeline.cameraPoseDefault();
            }
            _updateBackgroundTexture(e) {
              this.pipeline.cameraFrameUploadGL();
              const t = this.pipeline.cameraFrameTextureGL();
              if (!t) return;
              const r = e.properties.get(this.backgroundTexture);
              (r.__webglTexture = t), (r.__webglInit = !0);
              const a = new n.THREE.Matrix4();
              a.fromArray(
                this.pipeline.cameraFrameTextureMatrix(
                  e.domElement.width,
                  e.domElement.height,
                  this._currentMirrorMode === o.Poses
                )
              );
              const i = new n.THREE.Matrix3();
              i.setFromMatrix4(a),
                (i.elements[6] = a.elements[12]),
                (i.elements[7] = a.elements[13]),
                (i.elements[8] = 1),
                (this.backgroundTexture.matrixAutoUpdate = !1),
                (this.backgroundTexture.matrix = i);
            }
            dispose() {
              this.rearCameraSource.destroy(), this.userCameraSource.destroy();
            }
          }
          t.Camera = c;
        },
        6750: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.glContextLost =
              t.glContextSet =
              t.HTMLElementSource =
              t.CameraSource =
              t.InstantWorldTracker =
              t.FaceTracker =
              t.BarcodeFinder =
              t.ImageTracker =
              t.getDefaultPipeline =
              t.onFrameUpdate =
                void 0);
          const n = r(4772),
            a = r(1875);
          let i;
          function s() {
            return (
              i ||
                ((i = new n.Pipeline()),
                i.onFrameUpdate.bind(() => t.onFrameUpdate.emit())),
              i
            );
          }
          (t.onFrameUpdate = new a.Event()), (t.getDefaultPipeline = s);
          class o extends n.ImageTracker {
            constructor(e, t) {
              super(t || s(), e);
            }
          }
          t.ImageTracker = o;
          class c extends n.BarcodeFinder {
            constructor(e) {
              super(e || s());
            }
          }
          t.BarcodeFinder = c;
          class u extends n.FaceTracker {
            constructor(e) {
              super(e || s());
            }
          }
          t.FaceTracker = u;
          class _ extends n.InstantWorldTracker {
            constructor(e) {
              super(e || s());
            }
          }
          t.InstantWorldTracker = _;
          class l extends n.CameraSource {
            constructor(e, t) {
              super(t || s(), e);
            }
          }
          t.CameraSource = l;
          class f extends n.HTMLElementSource {
            constructor(e, t) {
              super(t || s(), e);
            }
          }
          (t.HTMLElementSource = f),
            (t.glContextSet = function (e) {
              s().glContextSet(e);
            }),
            (t.glContextLost = function () {
              s().glContextLost();
            });
        },
        1012: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.FaceAnchorGroup = void 0);
          const n = r(445),
            a = r(4823);
          class i extends n.THREE.Group {
            constructor(e, t, r) {
              super(),
                (this._camera = e),
                (this.faceTracker = t),
                (this.anchorId = r),
                (this.isReady = !1),
                (this.matrixAutoUpdate = !1);
            }
            updateMatrixWorld(e) {
              (this.currentAnchor &&
                this.faceTracker.visible.has(this.currentAnchor)) ||
                (this.anchorId
                  ? (this.currentAnchor = this.faceTracker.anchors.get(
                      this.anchorId
                    ))
                  : (this.currentAnchor = this.faceTracker.visible
                      .values()
                      .next().value)),
                this.currentAnchor &&
                  this.matrix.fromArray(
                    this.currentAnchor.pose(
                      this._camera.rawPose,
                      this._camera.currentMirrorMode ===
                        a.CameraMirrorMode.Poses
                    )
                  ),
                super.updateMatrixWorld(e);
            }
          }
          t.FaceAnchorGroup = i;
        },
        6673: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.FaceBufferGeometry = void 0);
          const n = r(445),
            a = r(5600);
          let i;
          class s extends n.THREE.BufferGeometry {
            constructor(e) {
              super(),
                (this._hasSetIndices = !1),
                (this._hasSetUVs = !1),
                (this._calculateNormals = !0),
                e || (i || (i = new a.FaceMeshLoader().load()), (e = i)),
                (this._faceMesh = e);
            }
            _updateIndices() {
              this._hasSetIndices ||
                (0 !== this._faceMesh.indices.length &&
                  (this.setIndex(
                    new n.THREE.Uint16BufferAttribute(this._faceMesh.indices, 1)
                  ),
                  (this._hasSetIndices = !0)));
            }
            _updateUVs() {
              this._hasSetUVs ||
                (0 !== this._faceMesh.uvs.length &&
                  (this.setAttribute(
                    "uv",
                    new n.THREE.BufferAttribute(this._faceMesh.uvs, 2)
                  ),
                  (this._hasSetUVs = !0)));
            }
            get calculateNormals() {
              return this._calculateNormals;
            }
            set calculateNormals(e) {
              (this._calculateNormals = e),
                this._calculateNormals ||
                  (this.removeAttribute("normal"), delete this._normals);
            }
            updateFromFaceAnchorGroup(e) {
              0 !== this._faceMesh.vertices.length &&
                e.currentAnchor &&
                this.updateFromFaceAnchor(e.currentAnchor);
            }
            updateFromFaceAnchor(e) {
              this.updateFromIdentityExpression(e.identity, e.expression);
            }
            updateFromIdentityExpression(e, t) {
              0 !== this._faceMesh.vertices.length &&
                (this._updateIndices(),
                this._updateUVs(),
                this._faceMesh.updateFromIdentityExpression(e, t),
                this._vertices ||
                  ((this._vertices = new Float32Array(
                    this._faceMesh.vertices.length
                  )),
                  (this._verticesAttribute = new n.THREE.BufferAttribute(
                    this._vertices,
                    3
                  )),
                  this.setAttribute("position", this._verticesAttribute)),
                this._vertices.set(this._faceMesh.vertices),
                this._verticesAttribute &&
                  (this._verticesAttribute.needsUpdate = !0),
                this.computeBoundingSphere(),
                this.calculateNormals &&
                  (this._normals ||
                    ((this._normals = new Float32Array(
                      this._faceMesh.normals.length
                    )),
                    (this._normalsAttribute = new n.THREE.BufferAttribute(
                      this._normals,
                      3
                    )),
                    this.setAttribute("normal", this._normalsAttribute)),
                  this._normals.set(this._faceMesh.normals),
                  this._normalsAttribute &&
                    (this._normalsAttribute.needsUpdate = !0)));
            }
          }
          t.FaceBufferGeometry = s;
        },
        1681: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.FaceLandmarkGroup = void 0);
          const n = r(445),
            a = r(4772),
            i = r(4823),
            s = r(887);
          class o extends n.THREE.Group {
            constructor(e, t, r) {
              super(),
                (this._camera = e),
                (this.faceTracker = t),
                (this._pose = s.mat4.create()),
                (this.landmark = new a.FaceLandmark(r)),
                (this.matrixAutoUpdate = !1);
            }
            updateMatrixWorld(e) {
              (this.currentAnchor &&
                this.faceTracker.visible.has(this.currentAnchor)) ||
                (this.currentAnchor = this.faceTracker.visible
                  .values()
                  .next().value),
                this.currentAnchor &&
                  (this.landmark.updateFromFaceAnchor(
                    this.currentAnchor,
                    this._camera.currentMirrorMode === i.CameraMirrorMode.Poses
                  ),
                  s.mat4.multiply(
                    this._pose,
                    this.currentAnchor.pose(
                      this._camera.rawPose,
                      this._camera.currentMirrorMode ===
                        i.CameraMirrorMode.Poses
                    ),
                    this.landmark.pose
                  ),
                  this.matrix.fromArray(this._pose)),
                super.updateMatrixWorld(e);
            }
            dispose() {
              this.landmark.destroy();
            }
          }
          t.FaceLandmarkGroup = o;
        },
        5600: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.FaceMeshLoader = void 0);
          const n = r(445),
            a = r(4772);
          class i extends n.THREE.Loader {
            constructor(e) {
              super(e);
            }
            load(e, t, r, n) {
              const i = new a.FaceMesh();
              let s;
              return (
                (s = e
                  ? "string" == typeof e
                    ? i.load(e)
                    : e.customModel
                    ? i.load(
                        e.customModel,
                        e.fillMouth,
                        e.fillEyeLeft,
                        e.fillEyeRight,
                        e.fillNeck
                      )
                    : i.loadDefaultFace(
                        e.fillMouth,
                        e.fillEyeLeft,
                        e.fillEyeRight
                      )
                  : i.loadDefaultFace()),
                s
                  .then(() => {
                    null == t || t(i);
                  })
                  .catch((e) => {
                    null == n || n(e);
                  }),
                i
              );
            }
            loadFace(e, t, r, n) {
              const i = new a.FaceMesh();
              let s;
              return (
                (s = e
                  ? e.customModel
                    ? i.load(
                        e.customModel,
                        e.fillMouth,
                        e.fillEyeLeft,
                        e.fillEyeRight,
                        e.fillNeck
                      )
                    : i.loadDefaultFace(
                        e.fillMouth,
                        e.fillEyeLeft,
                        e.fillEyeRight
                      )
                  : i.loadDefaultFace()),
                s
                  .then(() => {
                    null == t || t(i);
                  })
                  .catch((e) => {
                    null == n || n(e);
                  }),
                i
              );
            }
            loadFullHeadSimplified(e, t, r, n) {
              const i = new a.FaceMesh();
              let s;
              return (
                (s = e
                  ? e.customModel
                    ? i.load(
                        e.customModel,
                        e.fillMouth,
                        e.fillEyeLeft,
                        e.fillEyeRight,
                        e.fillNeck
                      )
                    : i.loadDefaultFullHeadSimplified(
                        e.fillMouth,
                        e.fillEyeLeft,
                        e.fillEyeRight,
                        e.fillNeck
                      )
                  : i.loadDefaultFullHeadSimplified()),
                s
                  .then(() => {
                    null == t || t(i);
                  })
                  .catch((e) => {
                    null == n || n(e);
                  }),
                i
              );
            }
            parse() {}
          }
          t.FaceMeshLoader = i;
        },
        7909: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.FaceTrackerLoader = void 0);
          const n = r(445),
            a = r(6750);
          class i extends n.THREE.Loader {
            constructor(e) {
              super(e);
            }
            load(e, t, r, n) {
              const i = new a.FaceTracker();
              return (
                (e ? i.loadModel(e) : i.loadDefaultModel())
                  .then(() => {
                    null == t || t(i);
                  })
                  .catch((e) => {
                    null == n || n(e);
                  }),
                i
              );
            }
            parse() {}
          }
          t.FaceTrackerLoader = i;
        },
        3053: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.HeadMaskMesh = void 0);
          const n = r(445),
            a = r(4772),
            i = r(6673);
          class s extends n.THREE.Mesh {
            constructor(e, t) {
              super(),
                (this.onLoad = e),
                (this.onError = t),
                (this._faceMesh = new a.FaceMesh()),
                (this._faceBufferGeometry = new i.FaceBufferGeometry(
                  this._faceMesh
                )),
                (this.geometry = this._faceBufferGeometry),
                (this.material = new n.THREE.MeshBasicMaterial({
                  colorWrite: !1,
                })),
                this._faceMesh
                  .loadDefaultFullHeadSimplified(!0, !0, !0, !0)
                  .then(() => {
                    var e;
                    return null === (e = this.onLoad) || void 0 === e
                      ? void 0
                      : e.call(this);
                  })
                  .catch(() => {
                    var e;
                    return null === (e = this.onError) || void 0 === e
                      ? void 0
                      : e.call(this);
                  }),
                (this.renderOrder = Number.MIN_SAFE_INTEGER);
            }
            updateFromFaceAnchorGroup(e) {
              this._faceBufferGeometry.updateFromFaceAnchorGroup(e);
            }
            updateFromFaceAnchor(e) {
              this._faceBufferGeometry.updateFromFaceAnchor(e);
            }
            updateFromIdentityExpression(e, t) {
              this._faceBufferGeometry.updateFromIdentityExpression(e, t);
            }
            dispose() {
              this._faceMesh.destroy(), this._faceBufferGeometry.dispose();
            }
          }
          t.HeadMaskMesh = s;
        },
        3723: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.HeadMaskMeshLoader = void 0);
          const n = r(445),
            a = r(3053);
          class i extends n.THREE.Loader {
            constructor(e) {
              super(e);
            }
            load(e, t, r) {
              return new a.HeadMaskMesh(e, r);
            }
            parse() {}
          }
          t.HeadMaskMeshLoader = i;
        },
        2861: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.ImageAnchorGroup = void 0);
          const n = r(445),
            a = r(4823);
          class i extends n.THREE.Group {
            constructor(e, t, r) {
              super(),
                (this._camera = e),
                (this.imageTracker = t),
                (this.anchorId = r),
                (this.isReady = !1),
                (this.matrixAutoUpdate = !1);
            }
            updateMatrixWorld(e) {
              (this.currentAnchor &&
                this.imageTracker.visible.has(this.currentAnchor)) ||
                (this.anchorId
                  ? (this.currentAnchor = this.imageTracker.anchors.get(
                      this.anchorId
                    ))
                  : (this.currentAnchor = this.imageTracker.visible
                      .values()
                      .next().value)),
                this.currentAnchor &&
                  this.matrix.fromArray(
                    this.currentAnchor.pose(
                      this._camera.rawPose,
                      this._camera.currentMirrorMode ===
                        a.CameraMirrorMode.Poses
                    )
                  ),
                super.updateMatrixWorld(e);
            }
          }
          t.ImageAnchorGroup = i;
        },
        2871: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.ImageTrackerLoader = void 0);
          const n = r(445),
            a = r(6750);
          class i extends n.THREE.Loader {
            constructor(e) {
              super(e);
            }
            load(e, t, r, n) {
              const i = new a.ImageTracker();
              return (
                i
                  .loadTarget(e)
                  .then(() => {
                    null == t || t(i);
                  })
                  .catch((e) => {
                    null == n || n(e);
                  }),
                i
              );
            }
            parse() {}
          }
          t.ImageTrackerLoader = i;
        },
        4017: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.browserIncompatibleUI =
              t.browserIncompatible =
              t.permissionRequestUI =
              t.permissionDeniedUI =
              t.permissionRequest =
              t.permissionGranted =
              t.permissionDenied =
              t.setLogLevel =
              t.LogLevel =
              t.Pipeline =
              t.FaceLandmarkName =
              t.FaceLandmark =
              t.FaceMesh =
              t.getDefaultPipeline =
              t.glContextLost =
              t.glContextSet =
              t.onFrameUpdate =
              t.HTMLElementSource =
              t.CameraSource =
              t.FaceTracker =
              t.BarcodeFinder =
              t.InstantWorldTracker =
              t.ImageTracker =
              t.DefaultLoaderUI =
              t.LoadingManager =
              t.HeadMaskMeshLoader =
              t.HeadMaskMesh =
              t.FaceMeshLoader =
              t.FaceBufferGeometry =
              t.FaceTrackerLoader =
              t.FaceLandmarkGroup =
              t.FaceAnchorGroup =
              t.InstantWorldAnchorGroup =
              t.ImageTrackerLoader =
              t.ImageAnchorGroup =
              t.CameraMirrorMode =
              t.CameraPoseMode =
              t.Camera =
              t.skipVersionLog =
                void 0);
          var n = r(3907);
          Object.defineProperty(t, "skipVersionLog", {
            enumerable: !0,
            get: function () {
              return n.skipVersionLog;
            },
          });
          var a = r(4823);
          Object.defineProperty(t, "Camera", {
            enumerable: !0,
            get: function () {
              return a.Camera;
            },
          }),
            Object.defineProperty(t, "CameraPoseMode", {
              enumerable: !0,
              get: function () {
                return a.CameraPoseMode;
              },
            }),
            Object.defineProperty(t, "CameraMirrorMode", {
              enumerable: !0,
              get: function () {
                return a.CameraMirrorMode;
              },
            });
          var i = r(2861);
          Object.defineProperty(t, "ImageAnchorGroup", {
            enumerable: !0,
            get: function () {
              return i.ImageAnchorGroup;
            },
          });
          var s = r(2871);
          Object.defineProperty(t, "ImageTrackerLoader", {
            enumerable: !0,
            get: function () {
              return s.ImageTrackerLoader;
            },
          });
          var o = r(9496);
          Object.defineProperty(t, "InstantWorldAnchorGroup", {
            enumerable: !0,
            get: function () {
              return o.InstantWorldAnchorGroup;
            },
          });
          var c = r(1012);
          Object.defineProperty(t, "FaceAnchorGroup", {
            enumerable: !0,
            get: function () {
              return c.FaceAnchorGroup;
            },
          });
          var u = r(1681);
          Object.defineProperty(t, "FaceLandmarkGroup", {
            enumerable: !0,
            get: function () {
              return u.FaceLandmarkGroup;
            },
          });
          var _ = r(7909);
          Object.defineProperty(t, "FaceTrackerLoader", {
            enumerable: !0,
            get: function () {
              return _.FaceTrackerLoader;
            },
          });
          var l = r(6673);
          Object.defineProperty(t, "FaceBufferGeometry", {
            enumerable: !0,
            get: function () {
              return l.FaceBufferGeometry;
            },
          });
          var f = r(5600);
          Object.defineProperty(t, "FaceMeshLoader", {
            enumerable: !0,
            get: function () {
              return f.FaceMeshLoader;
            },
          });
          var h = r(3053);
          Object.defineProperty(t, "HeadMaskMesh", {
            enumerable: !0,
            get: function () {
              return h.HeadMaskMesh;
            },
          });
          var d = r(3723);
          Object.defineProperty(t, "HeadMaskMeshLoader", {
            enumerable: !0,
            get: function () {
              return d.HeadMaskMeshLoader;
            },
          });
          var p = r(2475);
          Object.defineProperty(t, "LoadingManager", {
            enumerable: !0,
            get: function () {
              return p.LoadingManager;
            },
          }),
            Object.defineProperty(t, "DefaultLoaderUI", {
              enumerable: !0,
              get: function () {
                return p.DefaultLoaderUI;
              },
            });
          var m = r(6750);
          Object.defineProperty(t, "ImageTracker", {
            enumerable: !0,
            get: function () {
              return m.ImageTracker;
            },
          }),
            Object.defineProperty(t, "InstantWorldTracker", {
              enumerable: !0,
              get: function () {
                return m.InstantWorldTracker;
              },
            }),
            Object.defineProperty(t, "BarcodeFinder", {
              enumerable: !0,
              get: function () {
                return m.BarcodeFinder;
              },
            }),
            Object.defineProperty(t, "FaceTracker", {
              enumerable: !0,
              get: function () {
                return m.FaceTracker;
              },
            }),
            Object.defineProperty(t, "CameraSource", {
              enumerable: !0,
              get: function () {
                return m.CameraSource;
              },
            }),
            Object.defineProperty(t, "HTMLElementSource", {
              enumerable: !0,
              get: function () {
                return m.HTMLElementSource;
              },
            }),
            Object.defineProperty(t, "onFrameUpdate", {
              enumerable: !0,
              get: function () {
                return m.onFrameUpdate;
              },
            }),
            Object.defineProperty(t, "glContextSet", {
              enumerable: !0,
              get: function () {
                return m.glContextSet;
              },
            }),
            Object.defineProperty(t, "glContextLost", {
              enumerable: !0,
              get: function () {
                return m.glContextLost;
              },
            }),
            Object.defineProperty(t, "getDefaultPipeline", {
              enumerable: !0,
              get: function () {
                return m.getDefaultPipeline;
              },
            });
          var b = r(4772);
          Object.defineProperty(t, "FaceMesh", {
            enumerable: !0,
            get: function () {
              return b.FaceMesh;
            },
          }),
            Object.defineProperty(t, "FaceLandmark", {
              enumerable: !0,
              get: function () {
                return b.FaceLandmark;
              },
            }),
            Object.defineProperty(t, "FaceLandmarkName", {
              enumerable: !0,
              get: function () {
                return b.FaceLandmarkName;
              },
            }),
            Object.defineProperty(t, "Pipeline", {
              enumerable: !0,
              get: function () {
                return b.Pipeline;
              },
            }),
            Object.defineProperty(t, "LogLevel", {
              enumerable: !0,
              get: function () {
                return b.LogLevel;
              },
            }),
            Object.defineProperty(t, "setLogLevel", {
              enumerable: !0,
              get: function () {
                return b.setLogLevel;
              },
            }),
            Object.defineProperty(t, "permissionDenied", {
              enumerable: !0,
              get: function () {
                return b.permissionDenied;
              },
            }),
            Object.defineProperty(t, "permissionGranted", {
              enumerable: !0,
              get: function () {
                return b.permissionGranted;
              },
            }),
            Object.defineProperty(t, "permissionRequest", {
              enumerable: !0,
              get: function () {
                return b.permissionRequest;
              },
            }),
            Object.defineProperty(t, "permissionDeniedUI", {
              enumerable: !0,
              get: function () {
                return b.permissionDeniedUI;
              },
            }),
            Object.defineProperty(t, "permissionRequestUI", {
              enumerable: !0,
              get: function () {
                return b.permissionRequestUI;
              },
            }),
            Object.defineProperty(t, "browserIncompatible", {
              enumerable: !0,
              get: function () {
                return b.browserIncompatible;
              },
            }),
            Object.defineProperty(t, "browserIncompatibleUI", {
              enumerable: !0,
              get: function () {
                return b.browserIncompatibleUI;
              },
            });
        },
        9496: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.InstantWorldAnchorGroup = void 0);
          const n = r(445),
            a = r(4823);
          class i extends n.THREE.Group {
            constructor(e, t) {
              super(),
                (this._camera = e),
                (this.instantTracker = t),
                (this.matrixAutoUpdate = !1);
            }
            setAnchorPoseFromCameraOffset(e, t, r, n) {
              this.instantTracker.setAnchorPoseFromCameraOffset(e, t, r, n);
            }
            updateMatrixWorld(e) {
              this.matrix.fromArray(
                this.instantTracker.anchor.pose(
                  this._camera.rawPose,
                  this._camera.currentMirrorMode === a.CameraMirrorMode.Poses
                )
              ),
                super.updateMatrixWorld(e);
            }
          }
          t.InstantWorldAnchorGroup = i;
        },
        2475: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.LoadingManager = t.DefaultLoaderUI = void 0);
          const n = r(445);
          class a {
            constructor(e) {
              (this.lastLoadPercentage = 0),
                (this.divs = {
                  inner: document.createElement("div"),
                  title: document.createElement("div"),
                  progress: document.createElement("div"),
                  progressValue: document.createElement("div"),
                }),
                (this.css = {
                  container: {
                    position: "fixed",
                    width: "100%",
                    height: "100%",
                    top: "0px",
                    left: "0px",
                    zIndex: "10000",
                    backgroundColor: "rgba(0,0,0,0.8)",
                    fontFamily: "sans-serif",
                    color: "rgba(255,255,255,1)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "opacity 500ms",
                  },
                  inner: { maxWidth: "400px", textAlign: "center" },
                  title: { fontSize: "20px" },
                  progress: {
                    background: "rgba(255,255,255, 0.1)",
                    justifyContent: "flex-start",
                    borderRadius: "100px",
                    alignItems: "center",
                    position: "relative",
                    padding: "0 5px",
                    display: "flex",
                    height: "15px",
                    width: "250px",
                    margin: "15px",
                  },
                  progressValue: {
                    boxShadow: "0 10px 40px -10px #fff",
                    borderTopLeftRadius: "100px",
                    borderBottomLeftRadius: "100px",
                    background: "rgba(255,255,255,1)",
                    height: "10px",
                    width: "0",
                    transition: "width 500ms",
                  },
                }),
                (this.updateLoader = (e) => {
                  if (e < this.lastLoadPercentage) return;
                  this.lastLoadPercentage = e;
                  const t = document.getElementById(
                    "zappar-loader-progressValue"
                  );
                  (t.style.width = e + "%"),
                    (t.style.borderTopRightRadius = e + "px"),
                    (t.style.borderBottomRightRadius = e + "px"),
                    t.addEventListener("transitionend", () => {
                      100 == e &&
                        ((this.containerDiv.style.opacity = "0"),
                        this.containerDiv.addEventListener(
                          "transitionend",
                          (e) => {
                            "opacity" == e.propertyName && this.dispose();
                          }
                        ));
                    });
                }),
                (this.dispose = () => {
                  this.containerDiv.remove();
                }),
                (this.customStyle = e),
                (this.containerDiv = document.createElement("div"));
            }
            initialize() {
              for (const e in this.divs) this.divs[e].id = `zappar-loader-${e}`;
              this.refreshStyle(),
                this.divs.inner.appendChild(this.divs.title),
                this.divs.inner.appendChild(this.divs.progress),
                this.divs.progress.appendChild(this.divs.progressValue),
                this.containerDiv.appendChild(this.divs.inner),
                (this.divs.title.innerHTML = "Loading.."),
                document.body.append(this.containerDiv);
            }
            refreshStyle() {
              var e, t, r, n, a;
              Object.assign(
                this.css.container,
                null === (e = this.customStyle) || void 0 === e
                  ? void 0
                  : e.container
              ),
                Object.assign(
                  this.css.inner,
                  null === (t = this.customStyle) || void 0 === t
                    ? void 0
                    : t.inner
                ),
                Object.assign(
                  this.css.title,
                  null === (r = this.customStyle) || void 0 === r
                    ? void 0
                    : r.title
                ),
                Object.assign(
                  this.css.progress,
                  null === (n = this.customStyle) || void 0 === n
                    ? void 0
                    : n.progress
                ),
                Object.assign(
                  this.css.progressValue,
                  null === (a = this.customStyle) || void 0 === a
                    ? void 0
                    : a.progressValue
                ),
                Object.assign(this.containerDiv.style, this.css.container),
                Object.assign(this.divs.inner.style, this.css.inner),
                Object.assign(this.divs.title.style, this.css.title),
                Object.assign(this.divs.progress.style, this.css.progress),
                Object.assign(
                  this.divs.progressValue.style,
                  this.css.progressValue
                );
            }
          }
          t.DefaultLoaderUI = class extends a {
            constructor(e) {
              super(null == e ? void 0 : e.style),
                (n.THREE.DefaultLoadingManager.onStart = () => {
                  this.initialize();
                }),
                (n.THREE.DefaultLoadingManager.onLoad = () => {
                  var t;
                  null === (t = null == e ? void 0 : e.onLoad) ||
                    void 0 === t ||
                    t.call(e);
                }),
                (n.THREE.DefaultLoadingManager.onProgress = (e, t, r) => {
                  this.updateLoader((t / r) * 100);
                });
            }
          };
          class i extends n.THREE.LoadingManager {
            constructor(e) {
              super(
                () => {
                  var t;
                  return null === (t = null == e ? void 0 : e.onLoad) ||
                    void 0 === t
                    ? void 0
                    : t.call(e);
                },
                (t, r, n) => {
                  var a;
                  (this.ui.customStyle = null == e ? void 0 : e.style),
                    this.ui.refreshStyle(),
                    null === (a = null == e ? void 0 : e.onProgress) ||
                      void 0 === a ||
                      a.call(e, t, r, n),
                    this.ui.updateLoader((r / n) * 100);
                },
                null == e ? void 0 : e.onError
              ),
                (this.ui = new a()),
                (this.onStartCallback = void 0),
                (this.onStart = () => {
                  this.ui.initialize(),
                    this.onStartCallback && this.onStartCallback();
                }),
                (this._onStart = (e) => {
                  this.onStartCallback = e;
                }),
                (this.dispose = () => {
                  this.ui.dispose();
                });
            }
          }
          t.LoadingManager = i;
        },
        445: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.THREE = void 0);
          const n = r(4576);
          t.THREE = n.THREE;
        },
        3907: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.skipVersionLog = void 0),
            console.log("Zappar for ThreeJS v0.3.10");
          let r = !1;
          t.skipVersionLog = () => {
            r = !0;
          };
        },
        7323: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
          const n = r(1875),
            a = r(6127),
            i = r(2148);
          t.BarcodeFinder = class {
            constructor(e) {
              (this._pipeline = e),
                (this.onDetection = new n.Event1()),
                (this._lastDetected = []),
                (this._found = []),
                (this._formats = []),
                (this._frameUpdate = () => {
                  this._found = [];
                  let e = this._z.barcode_finder_found_number(this._impl);
                  for (let t = 0; t < e; t++)
                    this._found.push({
                      text: this._z.barcode_finder_found_text(this._impl, t),
                      format: this._z.barcode_finder_found_format(
                        this._impl,
                        t
                      ),
                    });
                  if (0 !== this._found.length) {
                    e: for (let e of this._found) {
                      for (let t of this._lastDetected)
                        if (t.text === e.text) continue e;
                      this.onDetection.emit(e);
                    }
                    this._lastDetected = this._found;
                  }
                }),
                this._pipeline._onFrameUpdateInternal.bind(this._frameUpdate),
                (this._z = i.z()),
                (this._impl = this._z.barcode_finder_create(
                  this._pipeline._getImpl()
                )),
                this._formats.push.apply(this._formats, [
                  a.barcode_format_t.AZTEC,
                  a.barcode_format_t.CODABAR,
                  a.barcode_format_t.CODE_39,
                  a.barcode_format_t.CODE_93,
                  a.barcode_format_t.CODE_128,
                  a.barcode_format_t.DATA_MATRIX,
                  a.barcode_format_t.EAN_8,
                  a.barcode_format_t.EAN_13,
                  a.barcode_format_t.ITF,
                  a.barcode_format_t.MAXICODE,
                  a.barcode_format_t.PDF_417,
                  a.barcode_format_t.QR_CODE,
                  a.barcode_format_t.RSS_14,
                  a.barcode_format_t.RSS_EXPANDED,
                  a.barcode_format_t.UPC_A,
                  a.barcode_format_t.UPC_E,
                  a.barcode_format_t.UPC_EAN_EXTENSION,
                ]);
            }
            destroy() {
              this._pipeline._onFrameUpdateInternal.unbind(this._frameUpdate),
                (this._found = []),
                (this._lastDetected = []),
                this._z.barcode_finder_destroy(this._impl);
            }
            get found() {
              return this._found;
            }
            get enabled() {
              return this._z.barcode_finder_enabled(this._impl);
            }
            set enabled(e) {
              this._z.barcode_finder_enabled_set(this._impl, e);
            }
            get formats() {
              return this._formats;
            }
            set formats(e) {
              this._formats = e.slice();
              let t = 0;
              for (let e of this._formats) t |= e;
              this._z.barcode_finder_formats_set(this._impl, t);
            }
          };
        },
        3320: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
          const n = r(2148);
          t.CameraSource = class {
            constructor(e, t) {
              (this._z = n.z()),
                (this._impl = this._z.camera_source_create(e._getImpl(), t));
            }
            destroy() {
              this._z.camera_source_destroy(this._impl);
            }
            start() {
              this._z.camera_source_start(this._impl);
            }
            pause() {
              this._z.camera_source_pause(this._impl);
            }
          };
        },
        1875: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.Event = class {
              constructor() {
                this._funcs = [];
              }
              bind(e) {
                this._funcs.push(e);
              }
              unbind(e) {
                let t = this._funcs.indexOf(e);
                t > -1 && this._funcs.splice(t, 1);
              }
              emit() {
                for (var e = 0, t = this._funcs.length; e < t; e++)
                  this._funcs[e]();
              }
            }),
            (t.Event1 = class {
              constructor() {
                this._funcs = [];
              }
              bind(e) {
                this._funcs.push(e);
              }
              unbind(e) {
                let t = this._funcs.indexOf(e);
                t > -1 && this._funcs.splice(t, 1);
              }
              emit(e) {
                for (var t = 0, r = this._funcs.length; t < r; t++)
                  this._funcs[t](e);
              }
            }),
            (t.Event2 = class {
              constructor() {
                this._funcs = [];
              }
              bind(e) {
                this._funcs.push(e);
              }
              unbind(e) {
                let t = this._funcs.indexOf(e);
                t > -1 && this._funcs.splice(t, 1);
              }
              emit(e, t) {
                for (var r = 0, n = this._funcs.length; r < n; r++)
                  this._funcs[r](e, t);
              }
            }),
            (t.Event3 = class {
              constructor() {
                this._funcs = [];
              }
              bind(e) {
                this._funcs.push(e);
              }
              unbind(e) {
                let t = this._funcs.indexOf(e);
                t > -1 && this._funcs.splice(t, 1);
              }
              emit(e, t, r) {
                for (var n = 0, a = this._funcs.length; n < a; n++)
                  this._funcs[n](e, t, r);
              }
            }),
            (t.Event5 = class {
              constructor() {
                this._funcs = [];
              }
              bind(e) {
                this._funcs.push(e);
              }
              unbind(e) {
                let t = this._funcs.indexOf(e);
                t > -1 && this._funcs.splice(t, 1);
              }
              emit(e, t, r, n, a) {
                for (var i = 0, s = this._funcs.length; i < s; i++)
                  this._funcs[i](e, t, r, n, a);
              }
            });
        },
        7027: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
          const n = r(2148),
            a = r(887);
          var i = r(6127);
          (t.FaceLandmarkName = i.face_landmark_name_t),
            (t.FaceLandmark = class {
              constructor(e) {
                (this._name = e),
                  (this.pose = a.mat4.create()),
                  (this._z = n.z()),
                  (this._impl = this._z.face_landmark_create(this._name));
              }
              destroy() {
                this._z.face_landmark_destroy(this._impl);
              }
              updateFromFaceAnchor(e, t) {
                this._z.face_landmark_update(
                  this._impl,
                  e.identity,
                  e.expression,
                  t || !1
                ),
                  (this.pose = this._z.face_landmark_anchor_pose(this._impl));
              }
              updateFromIdentityExpression(e, t, r) {
                this._z.face_landmark_update(this._impl, e, t, r || !1),
                  (this.pose = this._z.face_landmark_anchor_pose(this._impl));
              }
              _getImpl() {
                return this._impl;
              }
            });
        },
        9933: function (e, t, r) {
          "use strict";
          var n =
            (this && this.__awaiter) ||
            function (e, t, r, n) {
              return new (r || (r = Promise))(function (a, i) {
                function s(e) {
                  try {
                    c(n.next(e));
                  } catch (e) {
                    i(e);
                  }
                }
                function o(e) {
                  try {
                    c(n.throw(e));
                  } catch (e) {
                    i(e);
                  }
                }
                function c(e) {
                  var t;
                  e.done
                    ? a(e.value)
                    : ((t = e.value),
                      t instanceof r
                        ? t
                        : new r(function (e) {
                            e(t);
                          })).then(s, o);
                }
                c((n = n.apply(e, t || [])).next());
              });
            };
          Object.defineProperty(t, "__esModule", { value: !0 });
          const a = r(2148);
          t.FaceMesh = class {
            constructor() {
              (this._z = a.z()), (this._impl = this._z.face_mesh_create());
            }
            destroy() {
              this._z.face_mesh_destroy(this._impl);
            }
            load(e, t, r, a, i) {
              return n(this, void 0, void 0, function* () {
                "string" == typeof e &&
                  (e = yield (yield fetch(e)).arrayBuffer()),
                  this._z.face_mesh_load_from_memory(
                    this._impl,
                    e,
                    t || !1,
                    r || !1,
                    a || !1,
                    i || !1
                  );
              });
            }
            loadDefault() {
              return n(this, void 0, void 0, function* () {
                yield this._z.face_mesh_load_default(this._impl);
              });
            }
            loadDefaultFace(e, t, r) {
              return n(this, void 0, void 0, function* () {
                yield this._z.face_mesh_load_default_face(
                  this._impl,
                  e || !1,
                  t || !1,
                  r || !1
                );
              });
            }
            loadDefaultFullHeadSimplified(e, t, r, a) {
              return n(this, void 0, void 0, function* () {
                yield this._z.face_mesh_load_default_full_head_simplified(
                  this._impl,
                  e || !1,
                  t || !1,
                  r || !1,
                  a || !1
                );
              });
            }
            updateFromFaceAnchor(e, t) {
              this._z.face_mesh_update(
                this._impl,
                e.identity,
                e.expression,
                t || !1
              );
            }
            updateFromIdentityExpression(e, t, r) {
              this._z.face_mesh_update(this._impl, e, t, r || !1);
            }
            get vertices() {
              return this._z.face_mesh_vertices(this._impl);
            }
            get indices() {
              return this._z.face_mesh_indices(this._impl);
            }
            get uvs() {
              return this._z.face_mesh_uvs(this._impl);
            }
            get normals() {
              return this._z.face_mesh_normals(this._impl);
            }
            _getImpl() {
              return this._impl;
            }
          };
        },
        9122: function (e, t, r) {
          "use strict";
          var n =
            (this && this.__awaiter) ||
            function (e, t, r, n) {
              return new (r || (r = Promise))(function (a, i) {
                function s(e) {
                  try {
                    c(n.next(e));
                  } catch (e) {
                    i(e);
                  }
                }
                function o(e) {
                  try {
                    c(n.throw(e));
                  } catch (e) {
                    i(e);
                  }
                }
                function c(e) {
                  var t;
                  e.done
                    ? a(e.value)
                    : ((t = e.value),
                      t instanceof r
                        ? t
                        : new r(function (e) {
                            e(t);
                          })).then(s, o);
                }
                c((n = n.apply(e, t || [])).next());
              });
            };
          Object.defineProperty(t, "__esModule", { value: !0 });
          const a = r(1875),
            i = r(2148);
          t.FaceTracker = class {
            constructor(e) {
              (this._pipeline = e),
                (this.onVisible = new a.Event1()),
                (this.onNotVisible = new a.Event1()),
                (this.onNewAnchor = new a.Event1()),
                (this.visible = new Set()),
                (this.anchors = new Map()),
                (this._visibleLastFrame = new Set()),
                (this._frameUpdate = () => {
                  let e = new Set(),
                    t = this.visible;
                  (this.visible = this._visibleLastFrame),
                    (this._visibleLastFrame = t),
                    this.visible.clear();
                  let r = this._z.face_tracker_anchor_count(this._impl);
                  for (let t = 0; t < r; t++) {
                    let r = this._z.face_tracker_anchor_id(this._impl, t),
                      n = this.anchors.get(r),
                      i = !1;
                    n ||
                      ((n = {
                        onVisible: new a.Event(),
                        onNotVisible: new a.Event(),
                        id: r,
                        poseCameraRelative: (e) =>
                          this._z.face_tracker_anchor_pose_camera_relative(
                            this._impl,
                            t,
                            !0 === e
                          ),
                        pose: (e, r) =>
                          this._z.face_tracker_anchor_pose(
                            this._impl,
                            t,
                            e,
                            !0 === r
                          ),
                        identity: new Float32Array(50),
                        expression: new Float32Array(29),
                        visible: !0,
                      }),
                      (i = !0),
                      this.anchors.set(r, n),
                      e.add(n)),
                      (n.visible = !0),
                      (n.identity =
                        this._z.face_tracker_anchor_identity_coefficients(
                          this._impl,
                          t
                        )),
                      (n.expression =
                        this._z.face_tracker_anchor_expression_coefficients(
                          this._impl,
                          t
                        )),
                      this.visible.add(n);
                  }
                  for (let t of e) this.onNewAnchor.emit(t);
                  for (let e of this.visible)
                    this._visibleLastFrame.has(e)
                      ? this._visibleLastFrame.delete(e)
                      : (this.onVisible.emit(e), e.onVisible.emit());
                  for (let e of this._visibleLastFrame)
                    this.onNotVisible.emit(e), e.onNotVisible.emit();
                }),
                this._pipeline._onFrameUpdateInternal.bind(this._frameUpdate),
                (this._z = i.z()),
                (this._impl = this._z.face_tracker_create(
                  this._pipeline._getImpl()
                ));
            }
            destroy() {
              this._pipeline._onFrameUpdateInternal.unbind(this._frameUpdate),
                this.anchors.clear(),
                this.visible.clear(),
                this._z.face_tracker_destroy(this._impl);
            }
            loadModel(e) {
              return n(this, void 0, void 0, function* () {
                "string" == typeof e &&
                  (e = yield (yield fetch(e)).arrayBuffer()),
                  this._z.face_tracker_model_load_from_memory(this._impl, e);
              });
            }
            loadDefaultModel() {
              return n(this, void 0, void 0, function* () {
                yield this._z.face_tracker_model_load_default(this._impl);
              });
            }
            get enabled() {
              return this._z.face_tracker_enabled(this._impl);
            }
            set enabled(e) {
              this._z.face_tracker_enabled_set(this._impl, e);
            }
            get maxFaces() {
              return this._z.face_tracker_max_faces(this._impl);
            }
            set maxFaces(e) {
              this._z.face_tracker_max_faces_set(this._impl, e);
            }
          };
        },
        5649: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
          const n = r(2148);
          t.HTMLElementSource = class {
            constructor(e, t) {
              (this._z = n.z()),
                (this._impl = this._z.html_element_source_create(
                  e._getImpl(),
                  t
                ));
            }
            destroy() {
              this._z.html_element_source_destroy(this._impl);
            }
            start() {
              this._z.html_element_source_start(this._impl);
            }
            pause() {
              this._z.html_element_source_pause(this._impl);
            }
          };
        },
        465: function (e, t, r) {
          "use strict";
          var n =
            (this && this.__awaiter) ||
            function (e, t, r, n) {
              return new (r || (r = Promise))(function (a, i) {
                function s(e) {
                  try {
                    c(n.next(e));
                  } catch (e) {
                    i(e);
                  }
                }
                function o(e) {
                  try {
                    c(n.throw(e));
                  } catch (e) {
                    i(e);
                  }
                }
                function c(e) {
                  var t;
                  e.done
                    ? a(e.value)
                    : ((t = e.value),
                      t instanceof r
                        ? t
                        : new r(function (e) {
                            e(t);
                          })).then(s, o);
                }
                c((n = n.apply(e, t || [])).next());
              });
            };
          Object.defineProperty(t, "__esModule", { value: !0 });
          const a = r(1875),
            i = r(2148);
          t.ImageTracker = class {
            constructor(e, t) {
              (this._pipeline = e),
                (this.onVisible = new a.Event1()),
                (this.onNotVisible = new a.Event1()),
                (this.onNewAnchor = new a.Event1()),
                (this.visible = new Set()),
                (this.anchors = new Map()),
                (this._visibleLastFrame = new Set()),
                (this._frameUpdate = () => {
                  let e = new Set(),
                    t = this.visible;
                  (this.visible = this._visibleLastFrame),
                    (this._visibleLastFrame = t),
                    this.visible.clear();
                  let r = this._z.image_tracker_anchor_count(this._impl);
                  for (let t = 0; t < r; t++) {
                    let r = this._z.image_tracker_anchor_id(this._impl, t),
                      n = this.anchors.get(r),
                      i = !1;
                    n ||
                      ((n = {
                        onVisible: new a.Event(),
                        onNotVisible: new a.Event(),
                        id: r,
                        poseCameraRelative: (e) =>
                          this._z.image_tracker_anchor_pose_camera_relative(
                            this._impl,
                            t,
                            !0 === e
                          ),
                        pose: (e, r) =>
                          this._z.image_tracker_anchor_pose(
                            this._impl,
                            t,
                            e,
                            !0 === r
                          ),
                        visible: !0,
                      }),
                      (i = !0),
                      this.anchors.set(r, n),
                      e.add(n)),
                      (n.visible = !0),
                      this.visible.add(n);
                  }
                  for (let t of e) this.onNewAnchor.emit(t);
                  for (let e of this.visible)
                    this._visibleLastFrame.has(e)
                      ? this._visibleLastFrame.delete(e)
                      : (this.onVisible.emit(e), e.onVisible.emit());
                  for (let e of this._visibleLastFrame)
                    this.onNotVisible.emit(e), e.onNotVisible.emit();
                }),
                this._pipeline._onFrameUpdateInternal.bind(this._frameUpdate),
                (this._z = i.z()),
                (this._impl = this._z.image_tracker_create(
                  this._pipeline._getImpl()
                )),
                t && this.loadTarget(t);
            }
            destroy() {
              this._pipeline._onFrameUpdateInternal.unbind(this._frameUpdate),
                this.anchors.clear(),
                this.visible.clear(),
                this._z.image_tracker_destroy(this._impl);
            }
            loadTarget(e) {
              return n(this, void 0, void 0, function* () {
                "string" == typeof e &&
                  (e = yield (yield fetch(e)).arrayBuffer()),
                  this._z.image_tracker_target_load_from_memory(this._impl, e);
              });
            }
            get enabled() {
              return this._z.image_tracker_enabled(this._impl);
            }
            set enabled(e) {
              this._z.image_tracker_enabled_set(this._impl, e);
            }
          };
        },
        4772: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
          var n = r(465);
          t.ImageTracker = n.ImageTracker;
          var a = r(9503);
          t.InstantWorldTracker = a.InstantWorldTracker;
          var i = r(7323);
          t.BarcodeFinder = i.BarcodeFinder;
          var s = r(9122);
          t.FaceTracker = s.FaceTracker;
          var o = r(9933);
          t.FaceMesh = o.FaceMesh;
          var c = r(3320);
          t.CameraSource = c.CameraSource;
          var u = r(5649);
          t.HTMLElementSource = u.HTMLElementSource;
          var _ = r(9811);
          t.Pipeline = _.Pipeline;
          var l = r(7027);
          (t.FaceLandmarkName = l.FaceLandmarkName),
            (t.FaceLandmark = l.FaceLandmark);
          var f = r(567);
          (t.permissionDeniedUI = f.permissionDeniedUI),
            (t.permissionGranted = f.permissionGranted),
            (t.permissionDenied = f.permissionDenied),
            (t.permissionRequest = f.permissionRequest),
            (t.permissionRequestUI = f.permissionRequestUI),
            (t.Permission = f.Permission);
          var h = r(9719);
          (t.LogLevel = h.LogLevel),
            (t.setLogLevel = h.setLogLevel),
            (t.logLevel = h.logLevel);
          var d = r(2148);
          (t.cameraDefaultDeviceID = d.cameraDefaultDeviceID),
            (t.invert = d.invert),
            (t.drawPlane = d.drawPlane),
            (t.projectionMatrixFromCameraModel =
              d.projectionMatrixFromCameraModel),
            (t.browserIncompatible = d.browserIncompatible),
            (t.browserIncompatibleUI = d.browserIncompatibleUI);
        },
        9503: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
          const n = r(6127),
            a = r(2148);
          (t.InstantWorldTracker = class {
            constructor(e) {
              (this._pipeline = e),
                (this.anchor = {
                  poseCameraRelative: (e) => this._anchorPoseCameraRelative(e),
                  pose: (e, t) => this._anchorPose(e, t),
                }),
                (this._z = a.z()),
                (this._impl = this._z.instant_world_tracker_create(
                  this._pipeline._getImpl()
                ));
            }
            destroy() {
              this._z.instant_world_tracker_destroy(this._impl);
            }
            _anchorPoseCameraRelative(e) {
              return this._z.instant_world_tracker_anchor_pose_camera_relative(
                this._impl,
                !0 === e
              );
            }
            _anchorPose(e, t) {
              return this._z.instant_world_tracker_anchor_pose(
                this._impl,
                e,
                !0 === t
              );
            }
            get enabled() {
              return this._z.instant_world_tracker_enabled(this._impl);
            }
            set enabled(e) {
              this._z.instant_world_tracker_enabled_set(this._impl, e);
            }
            setAnchorPoseFromCameraOffset(e, t, r, a) {
              this._z.instant_world_tracker_anchor_pose_set_from_camera_offset(
                this._impl,
                e,
                t,
                r,
                a ||
                  n.instant_world_tracker_transform_orientation_t
                    .MINUS_Z_AWAY_FROM_USER
              );
            }
          }),
            new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
        },
        9719: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
          const n = r(2148);
          var a = r(6127);
          (t.LogLevel = a.log_level_t),
            (t.logLevel = function () {
              return n.z().log_level();
            }),
            (t.setLogLevel = function (e) {
              n.z().log_level_set(e);
            });
        },
        567: function (e, t, r) {
          "use strict";
          var n =
            (this && this.__awaiter) ||
            function (e, t, r, n) {
              return new (r || (r = Promise))(function (a, i) {
                function s(e) {
                  try {
                    c(n.next(e));
                  } catch (e) {
                    i(e);
                  }
                }
                function o(e) {
                  try {
                    c(n.throw(e));
                  } catch (e) {
                    i(e);
                  }
                }
                function c(e) {
                  var t;
                  e.done
                    ? a(e.value)
                    : ((t = e.value),
                      t instanceof r
                        ? t
                        : new r(function (e) {
                            e(t);
                          })).then(s, o);
                }
                c((n = n.apply(e, t || [])).next());
              });
            };
          Object.defineProperty(t, "__esModule", { value: !0 });
          const a = r(2148);
          var i;
          !(function (e) {
            (e[(e.CAMERA = 0)] = "CAMERA"), (e[(e.MOTION = 1)] = "MOTION");
          })((i = t.Permission || (t.Permission = {}))),
            (t.permissionGranted = function (e) {
              switch (e) {
                case i.CAMERA:
                  return a.z().permission_granted_camera();
                case i.MOTION:
                  return a.z().permission_granted_motion();
                default:
                  return a.z().permission_granted_all();
              }
            }),
            (t.permissionDenied = function (e) {
              switch (e) {
                case i.CAMERA:
                  return a.z().permission_denied_camera();
                case i.MOTION:
                  return a.z().permission_denied_motion();
                default:
                  return a.z().permission_denied_any();
              }
            }),
            (t.permissionRequest = function (e) {
              switch (e) {
                case i.CAMERA:
                  a.z().permission_request_camera();
                  break;
                case i.MOTION:
                  a.z().permission_request_motion();
                  break;
                default:
                  a.z().permission_request_all();
              }
              return new Promise((t) =>
                n(this, void 0, void 0, function* () {
                  for (;;)
                    switch (
                      (yield new Promise((e) =>
                        requestAnimationFrame(() => e())
                      ),
                      e)
                    ) {
                      case i.CAMERA:
                        if (a.z().permission_granted_camera())
                          return void t(!0);
                        if (a.z().permission_denied_camera()) return void t(!1);
                        break;
                      case i.MOTION:
                        if (a.z().permission_granted_motion())
                          return void t(!0);
                        if (a.z().permission_denied_motion()) return void t(!1);
                        break;
                      default:
                        if (
                          a.z().permission_granted_camera() &&
                          a.z().permission_granted_motion()
                        )
                          return void t(!0);
                        if (
                          a.z().permission_denied_camera() ||
                          a.z().permission_denied_motion()
                        )
                          return void t(!1);
                    }
                })
              );
            }),
            (t.permissionRequestUI = function () {
              return n(this, void 0, void 0, function* () {
                return yield a.z().permission_request_ui_promise();
              });
            }),
            (t.permissionDeniedUI = function () {
              return a.z().permission_denied_ui();
            });
        },
        9811: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
          const n = r(2148),
            a = r(1875);
          t.Pipeline = class {
            constructor() {
              (this.onFrameUpdate = new a.Event()),
                (this._onFrameUpdateInternal = new a.Event()),
                (this._lastFrameNumber = -1),
                (this._z = n.z()),
                (this._impl = this._z.pipeline_create());
            }
            destroy() {
              this._z.pipeline_destroy(this._impl);
            }
            frameUpdate() {
              this._z.pipeline_frame_update(this._impl);
              let e = this._z.pipeline_frame_number(this._impl);
              e !== this._lastFrameNumber &&
                ((this._lastFrameNumber = e),
                this._onFrameUpdateInternal.emit(),
                this.onFrameUpdate.emit());
            }
            _getImpl() {
              return this._impl;
            }
            glContextSet(e) {
              this._z.pipeline_gl_context_set(this._impl, e);
            }
            glContextLost() {
              this._z.pipeline_gl_context_lost(this._impl);
            }
            cameraFrameTextureGL() {
              return this._z.pipeline_camera_frame_texture_gl(this._impl);
            }
            cameraFrameTextureMatrix(e, t, r) {
              return this._z.pipeline_camera_frame_texture_matrix(
                this._impl,
                e,
                t,
                !0 === r
              );
            }
            cameraFrameDrawGL(e, t, r) {
              this._z.pipeline_camera_frame_draw_gl(this._impl, e, t, r);
            }
            cameraFrameUploadGL() {
              this._z.pipeline_camera_frame_upload_gl(this._impl);
            }
            processGL() {
              this._z.pipeline_process_gl(this._impl);
            }
            cameraModel() {
              return this._z.pipeline_camera_model(this._impl);
            }
            cameraPoseDefault() {
              return this._z.pipeline_camera_pose_default(this._impl);
            }
            cameraPoseWithAttitude(e) {
              return this._z.pipeline_camera_pose_with_attitude(
                this._impl,
                e || !1
              );
            }
            cameraPoseWithOrigin(e) {
              return this._z.pipeline_camera_pose_with_origin(this._impl, e);
            }
            cameraFrameUserFacing() {
              return this._z.pipeline_camera_frame_user_facing(this._impl);
            }
            drawFace(e, t, r, n) {
              this._z.pipeline_draw_face(this._impl, e, t, r, n._getImpl());
            }
            frameNumber() {
              return this._z.pipeline_frame_number(this._impl);
            }
          };
        },
        598: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.VERSION = "0.3.8");
        },
        2148: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
          const n = r(6127),
            a = r(887),
            i = r(598);
          let s;
          function o() {
            return (
              s ||
                (console.log(`Zappar JS v${i.VERSION}`), (s = n.initialize())),
              s
            );
          }
          (t.z = o),
            (t.cameraDefaultDeviceID = function (e) {
              return o().camera_default_device_id(e || !1);
            }),
            (t.invert = function (e) {
              let t = a.mat4.create();
              return a.mat4.invert(t, e), t;
            }),
            (t.projectionMatrixFromCameraModel = function (e, t, r) {
              return o().projection_matrix_from_camera_model(e, t, r);
            }),
            (t.drawPlane = function (e, t, r, n, a) {
              o().draw_plane(e, t, r, n, a);
            }),
            (t.browserIncompatible = function () {
              return o().browser_incompatible();
            }),
            (t.browserIncompatibleUI = function () {
              o().browser_incompatible_ui();
            });
        },
        8333: (e, t, r) => {
          "use strict";
          r.r(t), r.d(t, { default: () => n });
          const n = r.p + "b4f46e148a3b3b5aef90717d8d60e3fc.zbin";
        },
        7319: (e, t, r) => {
          "use strict";
          r.r(t), r.d(t, { default: () => n });
          const n = r.p + "f7b62a3a53b5c9b3222ba8dc53cb8b11.zbin";
        },
        7006: (e, t, r) => {
          "use strict";
          r.r(t), r.d(t, { default: () => n });
          const n = r.p + "482727c0e7dd40d73f5aae47f238ad61.zbin";
        },
        9740: (e, t, r) => {
          "use strict";
          r.d(t, { Z: () => n });
          const n = r.p + "79a9ee7cc93d3f6956fc17a4ad1de0d5.wasm";
        },
        887: (e, t, r) => {
          "use strict";
          r.r(t),
            r.d(t, {
              glMatrix: () => n,
              mat2: () => a,
              mat2d: () => i,
              mat3: () => s,
              mat4: () => o,
              quat: () => _,
              quat2: () => l,
              vec2: () => f,
              vec3: () => c,
              vec4: () => u,
            });
          var n = {};
          r.r(n),
            r.d(n, {
              ARRAY_TYPE: () => d,
              EPSILON: () => h,
              RANDOM: () => p,
              equals: () => y,
              setMatrixArrayType: () => m,
              toRadian: () => g,
            });
          var a = {};
          r.r(a),
            r.d(a, {
              LDU: () => D,
              add: () => B,
              adjoint: () => z,
              clone: () => w,
              copy: () => M,
              create: () => v,
              determinant: () => S,
              equals: () => V,
              exactEquals: () => U,
              frob: () => I,
              fromRotation: () => R,
              fromScaling: () => O,
              fromValues: () => E,
              identity: () => x,
              invert: () => T,
              mul: () => q,
              multiply: () => F,
              multiplyScalar: () => N,
              multiplyScalarAndAdd: () => G,
              rotate: () => L,
              scale: () => C,
              set: () => k,
              str: () => P,
              sub: () => H,
              subtract: () => j,
              transpose: () => A,
            });
          var i = {};
          r.r(i),
            r.d(i, {
              add: () => ue,
              clone: () => Y,
              copy: () => X,
              create: () => W,
              determinant: () => J,
              equals: () => de,
              exactEquals: () => he,
              frob: () => ce,
              fromRotation: () => ae,
              fromScaling: () => ie,
              fromTranslation: () => se,
              fromValues: () => K,
              identity: () => Z,
              invert: () => Q,
              mul: () => pe,
              multiply: () => ee,
              multiplyScalar: () => le,
              multiplyScalarAndAdd: () => fe,
              rotate: () => te,
              scale: () => re,
              set: () => $,
              str: () => oe,
              sub: () => me,
              subtract: () => _e,
              translate: () => ne,
            });
          var s = {};
          r.r(s),
            r.d(s, {
              add: () => Ve,
              adjoint: () => Ae,
              clone: () => ye,
              copy: () => ve,
              create: () => be,
              determinant: () => Te,
              equals: () => We,
              exactEquals: () => He,
              frob: () => Ue,
              fromMat2d: () => Pe,
              fromMat4: () => ge,
              fromQuat: () => Ie,
              fromRotation: () => Re,
              fromScaling: () => Oe,
              fromTranslation: () => Ce,
              fromValues: () => we,
              identity: () => xe,
              invert: () => ke,
              mul: () => Ye,
              multiply: () => ze,
              multiplyScalar: () => Ge,
              multiplyScalarAndAdd: () => qe,
              normalFromMat4: () => De,
              projection: () => Be,
              rotate: () => Fe,
              scale: () => Le,
              set: () => Me,
              str: () => je,
              sub: () => Xe,
              subtract: () => Ne,
              translate: () => Se,
              transpose: () => Ee,
            });
          var o = {};
          r.r(o),
            r.d(o, {
              add: () => Ot,
              adjoint: () => nt,
              clone: () => Ke,
              copy: () => $e,
              create: () => Ze,
              determinant: () => at,
              equals: () => jt,
              exactEquals: () => Bt,
              frob: () => Rt,
              fromQuat: () => kt,
              fromQuat2: () => yt,
              fromRotation: () => dt,
              fromRotationTranslation: () => gt,
              fromRotationTranslationScale: () => xt,
              fromRotationTranslationScaleOrigin: () => Et,
              fromScaling: () => ht,
              fromTranslation: () => ft,
              fromValues: () => Qe,
              fromXRotation: () => pt,
              fromYRotation: () => mt,
              fromZRotation: () => bt,
              frustum: () => At,
              getRotation: () => Mt,
              getScaling: () => wt,
              getTranslation: () => vt,
              identity: () => et,
              invert: () => rt,
              lookAt: () => Ft,
              mul: () => Ut,
              multiply: () => it,
              multiplyScalar: () => It,
              multiplyScalarAndAdd: () => Dt,
              ortho: () => St,
              perspective: () => Tt,
              perspectiveFromFieldOfView: () => zt,
              rotate: () => ct,
              rotateX: () => ut,
              rotateY: () => _t,
              rotateZ: () => lt,
              scale: () => ot,
              set: () => Je,
              str: () => Ct,
              sub: () => Vt,
              subtract: () => Pt,
              targetTo: () => Lt,
              translate: () => st,
              transpose: () => tt,
            });
          var c = {};
          r.r(c),
            r.d(c, {
              add: () => Xt,
              angle: () => xr,
              bezier: () => pr,
              ceil: () => Qt,
              clone: () => Gt,
              copy: () => Wt,
              create: () => Nt,
              cross: () => fr,
              dist: () => Cr,
              distance: () => ir,
              div: () => Lr,
              divide: () => $t,
              dot: () => lr,
              equals: () => Tr,
              exactEquals: () => Ar,
              floor: () => Jt,
              forEach: () => Ir,
              fromValues: () => Ht,
              hermite: () => dr,
              inverse: () => ur,
              len: () => Or,
              length: () => qt,
              lerp: () => hr,
              max: () => tr,
              min: () => er,
              mul: () => Fr,
              multiply: () => Kt,
              negate: () => cr,
              normalize: () => _r,
              random: () => mr,
              rotateX: () => vr,
              rotateY: () => wr,
              rotateZ: () => Mr,
              round: () => rr,
              scale: () => nr,
              scaleAndAdd: () => ar,
              set: () => Yt,
              sqrDist: () => Rr,
              sqrLen: () => Pr,
              squaredDistance: () => sr,
              squaredLength: () => or,
              str: () => kr,
              sub: () => Sr,
              subtract: () => Zt,
              transformMat3: () => gr,
              transformMat4: () => br,
              transformQuat: () => yr,
              zero: () => Er,
            });
          var u = {};
          r.r(u),
            r.d(u, {
              add: () => Nr,
              ceil: () => Wr,
              clone: () => Br,
              copy: () => Ur,
              create: () => Dr,
              cross: () => cn,
              dist: () => vn,
              distance: () => Jr,
              div: () => yn,
              divide: () => Hr,
              dot: () => on,
              equals: () => mn,
              exactEquals: () => pn,
              floor: () => Yr,
              forEach: () => En,
              fromValues: () => jr,
              inverse: () => an,
              len: () => Mn,
              length: () => tn,
              lerp: () => un,
              max: () => Zr,
              min: () => Xr,
              mul: () => gn,
              multiply: () => qr,
              negate: () => nn,
              normalize: () => sn,
              random: () => _n,
              round: () => Kr,
              scale: () => $r,
              scaleAndAdd: () => Qr,
              set: () => Vr,
              sqrDist: () => wn,
              sqrLen: () => xn,
              squaredDistance: () => en,
              squaredLength: () => rn,
              str: () => dn,
              sub: () => bn,
              subtract: () => Gr,
              transformMat4: () => ln,
              transformQuat: () => fn,
              zero: () => hn,
            });
          var _ = {};
          r.r(_),
            r.d(_, {
              add: () => ta,
              calculateW: () => On,
              clone: () => $n,
              conjugate: () => Vn,
              copy: () => Jn,
              create: () => kn,
              dot: () => aa,
              equals: () => fa,
              exactEquals: () => la,
              exp: () => Pn,
              fromEuler: () => Gn,
              fromMat3: () => Nn,
              fromValues: () => Qn,
              getAngle: () => Sn,
              getAxisAngle: () => zn,
              identity: () => An,
              invert: () => Un,
              len: () => oa,
              length: () => sa,
              lerp: () => ia,
              ln: () => In,
              mul: () => ra,
              multiply: () => Fn,
              normalize: () => _a,
              pow: () => Dn,
              random: () => jn,
              rotateX: () => Ln,
              rotateY: () => Cn,
              rotateZ: () => Rn,
              rotationTo: () => ha,
              scale: () => na,
              set: () => ea,
              setAxes: () => pa,
              setAxisAngle: () => Tn,
              slerp: () => Bn,
              sqlerp: () => da,
              sqrLen: () => ua,
              squaredLength: () => ca,
              str: () => qn,
            });
          var l = {};
          r.r(l),
            r.d(l, {
              add: () => ja,
              clone: () => ba,
              conjugate: () => Wa,
              copy: () => Ea,
              create: () => ma,
              dot: () => Ga,
              equals: () => ei,
              exactEquals: () => Ja,
              fromMat4: () => xa,
              fromRotation: () => Ma,
              fromRotationTranslation: () => va,
              fromRotationTranslationValues: () => ya,
              fromTranslation: () => wa,
              fromValues: () => ga,
              getDual: () => za,
              getReal: () => Ta,
              getTranslation: () => La,
              identity: () => ka,
              invert: () => Ha,
              len: () => Xa,
              length: () => Ya,
              lerp: () => qa,
              mul: () => Va,
              multiply: () => Ua,
              normalize: () => $a,
              rotateAroundAxis: () => Ba,
              rotateByQuatAppend: () => Ia,
              rotateByQuatPrepend: () => Da,
              rotateX: () => Ra,
              rotateY: () => Oa,
              rotateZ: () => Pa,
              scale: () => Na,
              set: () => Aa,
              setDual: () => Fa,
              setReal: () => Sa,
              sqrLen: () => Ka,
              squaredLength: () => Za,
              str: () => Qa,
              translate: () => Ca,
            });
          var f = {};
          r.r(f),
            r.d(f, {
              add: () => si,
              angle: () => Ri,
              ceil: () => _i,
              clone: () => ri,
              copy: () => ai,
              create: () => ti,
              cross: () => ki,
              dist: () => Ni,
              distance: () => bi,
              div: () => Vi,
              divide: () => ui,
              dot: () => Ei,
              equals: () => Di,
              exactEquals: () => Ii,
              floor: () => li,
              forEach: () => Hi,
              fromValues: () => ni,
              inverse: () => Mi,
              len: () => Bi,
              length: () => yi,
              lerp: () => Ai,
              max: () => hi,
              min: () => fi,
              mul: () => Ui,
              multiply: () => ci,
              negate: () => wi,
              normalize: () => xi,
              random: () => Ti,
              rotate: () => Ci,
              round: () => di,
              scale: () => pi,
              scaleAndAdd: () => mi,
              set: () => ii,
              sqrDist: () => Gi,
              sqrLen: () => qi,
              squaredDistance: () => gi,
              squaredLength: () => vi,
              str: () => Pi,
              sub: () => ji,
              subtract: () => oi,
              transformMat2: () => zi,
              transformMat2d: () => Si,
              transformMat3: () => Fi,
              transformMat4: () => Li,
              zero: () => Oi,
            });
          var h = 1e-6,
            d = "undefined" != typeof Float32Array ? Float32Array : Array,
            p = Math.random;
          function m(e) {
            d = e;
          }
          var b = Math.PI / 180;
          function g(e) {
            return e * b;
          }
          function y(e, t) {
            return Math.abs(e - t) <= h * Math.max(1, Math.abs(e), Math.abs(t));
          }
          function v() {
            var e = new d(4);
            return (
              d != Float32Array && ((e[1] = 0), (e[2] = 0)),
              (e[0] = 1),
              (e[3] = 1),
              e
            );
          }
          function w(e) {
            var t = new d(4);
            return (
              (t[0] = e[0]), (t[1] = e[1]), (t[2] = e[2]), (t[3] = e[3]), t
            );
          }
          function M(e, t) {
            return (
              (e[0] = t[0]), (e[1] = t[1]), (e[2] = t[2]), (e[3] = t[3]), e
            );
          }
          function x(e) {
            return (e[0] = 1), (e[1] = 0), (e[2] = 0), (e[3] = 1), e;
          }
          function E(e, t, r, n) {
            var a = new d(4);
            return (a[0] = e), (a[1] = t), (a[2] = r), (a[3] = n), a;
          }
          function k(e, t, r, n, a) {
            return (e[0] = t), (e[1] = r), (e[2] = n), (e[3] = a), e;
          }
          function A(e, t) {
            if (e === t) {
              var r = t[1];
              (e[1] = t[2]), (e[2] = r);
            } else (e[0] = t[0]), (e[1] = t[2]), (e[2] = t[1]), (e[3] = t[3]);
            return e;
          }
          function T(e, t) {
            var r = t[0],
              n = t[1],
              a = t[2],
              i = t[3],
              s = r * i - a * n;
            return s
              ? ((s = 1 / s),
                (e[0] = i * s),
                (e[1] = -n * s),
                (e[2] = -a * s),
                (e[3] = r * s),
                e)
              : null;
          }
          function z(e, t) {
            var r = t[0];
            return (e[0] = t[3]), (e[1] = -t[1]), (e[2] = -t[2]), (e[3] = r), e;
          }
          function S(e) {
            return e[0] * e[3] - e[2] * e[1];
          }
          function F(e, t, r) {
            var n = t[0],
              a = t[1],
              i = t[2],
              s = t[3],
              o = r[0],
              c = r[1],
              u = r[2],
              _ = r[3];
            return (
              (e[0] = n * o + i * c),
              (e[1] = a * o + s * c),
              (e[2] = n * u + i * _),
              (e[3] = a * u + s * _),
              e
            );
          }
          function L(e, t, r) {
            var n = t[0],
              a = t[1],
              i = t[2],
              s = t[3],
              o = Math.sin(r),
              c = Math.cos(r);
            return (
              (e[0] = n * c + i * o),
              (e[1] = a * c + s * o),
              (e[2] = n * -o + i * c),
              (e[3] = a * -o + s * c),
              e
            );
          }
          function C(e, t, r) {
            var n = t[0],
              a = t[1],
              i = t[2],
              s = t[3],
              o = r[0],
              c = r[1];
            return (
              (e[0] = n * o), (e[1] = a * o), (e[2] = i * c), (e[3] = s * c), e
            );
          }
          function R(e, t) {
            var r = Math.sin(t),
              n = Math.cos(t);
            return (e[0] = n), (e[1] = r), (e[2] = -r), (e[3] = n), e;
          }
          function O(e, t) {
            return (e[0] = t[0]), (e[1] = 0), (e[2] = 0), (e[3] = t[1]), e;
          }
          function P(e) {
            return (
              "mat2(" + e[0] + ", " + e[1] + ", " + e[2] + ", " + e[3] + ")"
            );
          }
          function I(e) {
            return Math.hypot(e[0], e[1], e[2], e[3]);
          }
          function D(e, t, r, n) {
            return (
              (e[2] = n[2] / n[0]),
              (r[0] = n[0]),
              (r[1] = n[1]),
              (r[3] = n[3] - e[2] * r[1]),
              [e, t, r]
            );
          }
          function B(e, t, r) {
            return (
              (e[0] = t[0] + r[0]),
              (e[1] = t[1] + r[1]),
              (e[2] = t[2] + r[2]),
              (e[3] = t[3] + r[3]),
              e
            );
          }
          function j(e, t, r) {
            return (
              (e[0] = t[0] - r[0]),
              (e[1] = t[1] - r[1]),
              (e[2] = t[2] - r[2]),
              (e[3] = t[3] - r[3]),
              e
            );
          }
          function U(e, t) {
            return (
              e[0] === t[0] && e[1] === t[1] && e[2] === t[2] && e[3] === t[3]
            );
          }
          function V(e, t) {
            var r = e[0],
              n = e[1],
              a = e[2],
              i = e[3],
              s = t[0],
              o = t[1],
              c = t[2],
              u = t[3];
            return (
              Math.abs(r - s) <= h * Math.max(1, Math.abs(r), Math.abs(s)) &&
              Math.abs(n - o) <= h * Math.max(1, Math.abs(n), Math.abs(o)) &&
              Math.abs(a - c) <= h * Math.max(1, Math.abs(a), Math.abs(c)) &&
              Math.abs(i - u) <= h * Math.max(1, Math.abs(i), Math.abs(u))
            );
          }
          function N(e, t, r) {
            return (
              (e[0] = t[0] * r),
              (e[1] = t[1] * r),
              (e[2] = t[2] * r),
              (e[3] = t[3] * r),
              e
            );
          }
          function G(e, t, r, n) {
            return (
              (e[0] = t[0] + r[0] * n),
              (e[1] = t[1] + r[1] * n),
              (e[2] = t[2] + r[2] * n),
              (e[3] = t[3] + r[3] * n),
              e
            );
          }
          Math.hypot ||
            (Math.hypot = function () {
              for (var e = 0, t = arguments.length; t--; )
                e += arguments[t] * arguments[t];
              return Math.sqrt(e);
            });
          var q = F,
            H = j;
          function W() {
            var e = new d(6);
            return (
              d != Float32Array &&
                ((e[1] = 0), (e[2] = 0), (e[4] = 0), (e[5] = 0)),
              (e[0] = 1),
              (e[3] = 1),
              e
            );
          }
          function Y(e) {
            var t = new d(6);
            return (
              (t[0] = e[0]),
              (t[1] = e[1]),
              (t[2] = e[2]),
              (t[3] = e[3]),
              (t[4] = e[4]),
              (t[5] = e[5]),
              t
            );
          }
          function X(e, t) {
            return (
              (e[0] = t[0]),
              (e[1] = t[1]),
              (e[2] = t[2]),
              (e[3] = t[3]),
              (e[4] = t[4]),
              (e[5] = t[5]),
              e
            );
          }
          function Z(e) {
            return (
              (e[0] = 1),
              (e[1] = 0),
              (e[2] = 0),
              (e[3] = 1),
              (e[4] = 0),
              (e[5] = 0),
              e
            );
          }
          function K(e, t, r, n, a, i) {
            var s = new d(6);
            return (
              (s[0] = e),
              (s[1] = t),
              (s[2] = r),
              (s[3] = n),
              (s[4] = a),
              (s[5] = i),
              s
            );
          }
          function $(e, t, r, n, a, i, s) {
            return (
              (e[0] = t),
              (e[1] = r),
              (e[2] = n),
              (e[3] = a),
              (e[4] = i),
              (e[5] = s),
              e
            );
          }
          function Q(e, t) {
            var r = t[0],
              n = t[1],
              a = t[2],
              i = t[3],
              s = t[4],
              o = t[5],
              c = r * i - n * a;
            return c
              ? ((c = 1 / c),
                (e[0] = i * c),
                (e[1] = -n * c),
                (e[2] = -a * c),
                (e[3] = r * c),
                (e[4] = (a * o - i * s) * c),
                (e[5] = (n * s - r * o) * c),
                e)
              : null;
          }
          function J(e) {
            return e[0] * e[3] - e[1] * e[2];
          }
          function ee(e, t, r) {
            var n = t[0],
              a = t[1],
              i = t[2],
              s = t[3],
              o = t[4],
              c = t[5],
              u = r[0],
              _ = r[1],
              l = r[2],
              f = r[3],
              h = r[4],
              d = r[5];
            return (
              (e[0] = n * u + i * _),
              (e[1] = a * u + s * _),
              (e[2] = n * l + i * f),
              (e[3] = a * l + s * f),
              (e[4] = n * h + i * d + o),
              (e[5] = a * h + s * d + c),
              e
            );
          }
          function te(e, t, r) {
            var n = t[0],
              a = t[1],
              i = t[2],
              s = t[3],
              o = t[4],
              c = t[5],
              u = Math.sin(r),
              _ = Math.cos(r);
            return (
              (e[0] = n * _ + i * u),
              (e[1] = a * _ + s * u),
              (e[2] = n * -u + i * _),
              (e[3] = a * -u + s * _),
              (e[4] = o),
              (e[5] = c),
              e
            );
          }
          function re(e, t, r) {
            var n = t[0],
              a = t[1],
              i = t[2],
              s = t[3],
              o = t[4],
              c = t[5],
              u = r[0],
              _ = r[1];
            return (
              (e[0] = n * u),
              (e[1] = a * u),
              (e[2] = i * _),
              (e[3] = s * _),
              (e[4] = o),
              (e[5] = c),
              e
            );
          }
          function ne(e, t, r) {
            var n = t[0],
              a = t[1],
              i = t[2],
              s = t[3],
              o = t[4],
              c = t[5],
              u = r[0],
              _ = r[1];
            return (
              (e[0] = n),
              (e[1] = a),
              (e[2] = i),
              (e[3] = s),
              (e[4] = n * u + i * _ + o),
              (e[5] = a * u + s * _ + c),
              e
            );
          }
          function ae(e, t) {
            var r = Math.sin(t),
              n = Math.cos(t);
            return (
              (e[0] = n),
              (e[1] = r),
              (e[2] = -r),
              (e[3] = n),
              (e[4] = 0),
              (e[5] = 0),
              e
            );
          }
          function ie(e, t) {
            return (
              (e[0] = t[0]),
              (e[1] = 0),
              (e[2] = 0),
              (e[3] = t[1]),
              (e[4] = 0),
              (e[5] = 0),
              e
            );
          }
          function se(e, t) {
            return (
              (e[0] = 1),
              (e[1] = 0),
              (e[2] = 0),
              (e[3] = 1),
              (e[4] = t[0]),
              (e[5] = t[1]),
              e
            );
          }
          function oe(e) {
            return (
              "mat2d(" +
              e[0] +
              ", " +
              e[1] +
              ", " +
              e[2] +
              ", " +
              e[3] +
              ", " +
              e[4] +
              ", " +
              e[5] +
              ")"
            );
          }
          function ce(e) {
            return Math.hypot(e[0], e[1], e[2], e[3], e[4], e[5], 1);
          }
          function ue(e, t, r) {
            return (
              (e[0] = t[0] + r[0]),
              (e[1] = t[1] + r[1]),
              (e[2] = t[2] + r[2]),
              (e[3] = t[3] + r[3]),
              (e[4] = t[4] + r[4]),
              (e[5] = t[5] + r[5]),
              e
            );
          }
          function _e(e, t, r) {
            return (
              (e[0] = t[0] - r[0]),
              (e[1] = t[1] - r[1]),
              (e[2] = t[2] - r[2]),
              (e[3] = t[3] - r[3]),
              (e[4] = t[4] - r[4]),
              (e[5] = t[5] - r[5]),
              e
            );
          }
          function le(e, t, r) {
            return (
              (e[0] = t[0] * r),
              (e[1] = t[1] * r),
              (e[2] = t[2] * r),
              (e[3] = t[3] * r),
              (e[4] = t[4] * r),
              (e[5] = t[5] * r),
              e
            );
          }
          function fe(e, t, r, n) {
            return (
              (e[0] = t[0] + r[0] * n),
              (e[1] = t[1] + r[1] * n),
              (e[2] = t[2] + r[2] * n),
              (e[3] = t[3] + r[3] * n),
              (e[4] = t[4] + r[4] * n),
              (e[5] = t[5] + r[5] * n),
              e
            );
          }
          function he(e, t) {
            return (
              e[0] === t[0] &&
              e[1] === t[1] &&
              e[2] === t[2] &&
              e[3] === t[3] &&
              e[4] === t[4] &&
              e[5] === t[5]
            );
          }
          function de(e, t) {
            var r = e[0],
              n = e[1],
              a = e[2],
              i = e[3],
              s = e[4],
              o = e[5],
              c = t[0],
              u = t[1],
              _ = t[2],
              l = t[3],
              f = t[4],
              d = t[5];
            return (
              Math.abs(r - c) <= h * Math.max(1, Math.abs(r), Math.abs(c)) &&
              Math.abs(n - u) <= h * Math.max(1, Math.abs(n), Math.abs(u)) &&
              Math.abs(a - _) <= h * Math.max(1, Math.abs(a), Math.abs(_)) &&
              Math.abs(i - l) <= h * Math.max(1, Math.abs(i), Math.abs(l)) &&
              Math.abs(s - f) <= h * Math.max(1, Math.abs(s), Math.abs(f)) &&
              Math.abs(o - d) <= h * Math.max(1, Math.abs(o), Math.abs(d))
            );
          }
          var pe = ee,
            me = _e;
          function be() {
            var e = new d(9);
            return (
              d != Float32Array &&
                ((e[1] = 0),
                (e[2] = 0),
                (e[3] = 0),
                (e[5] = 0),
                (e[6] = 0),
                (e[7] = 0)),
              (e[0] = 1),
              (e[4] = 1),
              (e[8] = 1),
              e
            );
          }
          function ge(e, t) {
            return (
              (e[0] = t[0]),
              (e[1] = t[1]),
              (e[2] = t[2]),
              (e[3] = t[4]),
              (e[4] = t[5]),
              (e[5] = t[6]),
              (e[6] = t[8]),
              (e[7] = t[9]),
              (e[8] = t[10]),
              e
            );
          }
          function ye(e) {
            var t = new d(9);
            return (
              (t[0] = e[0]),
              (t[1] = e[1]),
              (t[2] = e[2]),
              (t[3] = e[3]),
              (t[4] = e[4]),
              (t[5] = e[5]),
              (t[6] = e[6]),
              (t[7] = e[7]),
              (t[8] = e[8]),
              t
            );
          }
          function ve(e, t) {
            return (
              (e[0] = t[0]),
              (e[1] = t[1]),
              (e[2] = t[2]),
              (e[3] = t[3]),
              (e[4] = t[4]),
              (e[5] = t[5]),
              (e[6] = t[6]),
              (e[7] = t[7]),
              (e[8] = t[8]),
              e
            );
          }
          function we(e, t, r, n, a, i, s, o, c) {
            var u = new d(9);
            return (
              (u[0] = e),
              (u[1] = t),
              (u[2] = r),
              (u[3] = n),
              (u[4] = a),
              (u[5] = i),
              (u[6] = s),
              (u[7] = o),
              (u[8] = c),
              u
            );
          }
          function Me(e, t, r, n, a, i, s, o, c, u) {
            return (
              (e[0] = t),
              (e[1] = r),
              (e[2] = n),
              (e[3] = a),
              (e[4] = i),
              (e[5] = s),
              (e[6] = o),
              (e[7] = c),
              (e[8] = u),
              e
            );
          }
          function xe(e) {
            return (
              (e[0] = 1),
              (e[1] = 0),
              (e[2] = 0),
              (e[3] = 0),
              (e[4] = 1),
              (e[5] = 0),
              (e[6] = 0),
              (e[7] = 0),
              (e[8] = 1),
              e
            );
          }
          function Ee(e, t) {
            if (e === t) {
              var r = t[1],
                n = t[2],
                a = t[5];
              (e[1] = t[3]),
                (e[2] = t[6]),
                (e[3] = r),
                (e[5] = t[7]),
                (e[6] = n),
                (e[7] = a);
            } else
              (e[0] = t[0]),
                (e[1] = t[3]),
                (e[2] = t[6]),
                (e[3] = t[1]),
                (e[4] = t[4]),
                (e[5] = t[7]),
                (e[6] = t[2]),
                (e[7] = t[5]),
                (e[8] = t[8]);
            return e;
          }
          function ke(e, t) {
            var r = t[0],
              n = t[1],
              a = t[2],
              i = t[3],
              s = t[4],
              o = t[5],
              c = t[6],
              u = t[7],
              _ = t[8],
              l = _ * s - o * u,
              f = -_ * i + o * c,
              h = u * i - s * c,
              d = r * l + n * f + a * h;
            return d
              ? ((d = 1 / d),
                (e[0] = l * d),
                (e[1] = (-_ * n + a * u) * d),
                (e[2] = (o * n - a * s) * d),
                (e[3] = f * d),
                (e[4] = (_ * r - a * c) * d),
                (e[5] = (-o * r + a * i) * d),
                (e[6] = h * d),
                (e[7] = (-u * r + n * c) * d),
                (e[8] = (s * r - n * i) * d),
                e)
              : null;
          }
          function Ae(e, t) {
            var r = t[0],
              n = t[1],
              a = t[2],
              i = t[3],
              s = t[4],
              o = t[5],
              c = t[6],
              u = t[7],
              _ = t[8];
            return (
              (e[0] = s * _ - o * u),
              (e[1] = a * u - n * _),
              (e[2] = n * o - a * s),
              (e[3] = o * c - i * _),
              (e[4] = r * _ - a * c),
              (e[5] = a * i - r * o),
              (e[6] = i * u - s * c),
              (e[7] = n * c - r * u),
              (e[8] = r * s - n * i),
              e
            );
          }
          function Te(e) {
            var t = e[0],
              r = e[1],
              n = e[2],
              a = e[3],
              i = e[4],
              s = e[5],
              o = e[6],
              c = e[7],
              u = e[8];
            return (
              t * (u * i - s * c) + r * (-u * a + s * o) + n * (c * a - i * o)
            );
          }
          function ze(e, t, r) {
            var n = t[0],
              a = t[1],
              i = t[2],
              s = t[3],
              o = t[4],
              c = t[5],
              u = t[6],
              _ = t[7],
              l = t[8],
              f = r[0],
              h = r[1],
              d = r[2],
              p = r[3],
              m = r[4],
              b = r[5],
              g = r[6],
              y = r[7],
              v = r[8];
            return (
              (e[0] = f * n + h * s + d * u),
              (e[1] = f * a + h * o + d * _),
              (e[2] = f * i + h * c + d * l),
              (e[3] = p * n + m * s + b * u),
              (e[4] = p * a + m * o + b * _),
              (e[5] = p * i + m * c + b * l),
              (e[6] = g * n + y * s + v * u),
              (e[7] = g * a + y * o + v * _),
              (e[8] = g * i + y * c + v * l),
              e
            );
          }
          function Se(e, t, r) {
            var n = t[0],
              a = t[1],
              i = t[2],
              s = t[3],
              o = t[4],
              c = t[5],
              u = t[6],
              _ = t[7],
              l = t[8],
              f = r[0],
              h = r[1];
            return (
              (e[0] = n),
              (e[1] = a),
              (e[2] = i),
              (e[3] = s),
              (e[4] = o),
              (e[5] = c),
              (e[6] = f * n + h * s + u),
              (e[7] = f * a + h * o + _),
              (e[8] = f * i + h * c + l),
              e
            );
          }
          function Fe(e, t, r) {
            var n = t[0],
              a = t[1],
              i = t[2],
              s = t[3],
              o = t[4],
              c = t[5],
              u = t[6],
              _ = t[7],
              l = t[8],
              f = Math.sin(r),
              h = Math.cos(r);
            return (
              (e[0] = h * n + f * s),
              (e[1] = h * a + f * o),
              (e[2] = h * i + f * c),
              (e[3] = h * s - f * n),
              (e[4] = h * o - f * a),
              (e[5] = h * c - f * i),
              (e[6] = u),
              (e[7] = _),
              (e[8] = l),
              e
            );
          }
          function Le(e, t, r) {
            var n = r[0],
              a = r[1];
            return (
              (e[0] = n * t[0]),
              (e[1] = n * t[1]),
              (e[2] = n * t[2]),
              (e[3] = a * t[3]),
              (e[4] = a * t[4]),
              (e[5] = a * t[5]),
              (e[6] = t[6]),
              (e[7] = t[7]),
              (e[8] = t[8]),
              e
            );
          }
          function Ce(e, t) {
            return (
              (e[0] = 1),
              (e[1] = 0),
              (e[2] = 0),
              (e[3] = 0),
              (e[4] = 1),
              (e[5] = 0),
              (e[6] = t[0]),
              (e[7] = t[1]),
              (e[8] = 1),
              e
            );
          }
          function Re(e, t) {
            var r = Math.sin(t),
              n = Math.cos(t);
            return (
              (e[0] = n),
              (e[1] = r),
              (e[2] = 0),
              (e[3] = -r),
              (e[4] = n),
              (e[5] = 0),
              (e[6] = 0),
              (e[7] = 0),
              (e[8] = 1),
              e
            );
          }
          function Oe(e, t) {
            return (
              (e[0] = t[0]),
              (e[1] = 0),
              (e[2] = 0),
              (e[3] = 0),
              (e[4] = t[1]),
              (e[5] = 0),
              (e[6] = 0),
              (e[7] = 0),
              (e[8] = 1),
              e
            );
          }
          function Pe(e, t) {
            return (
              (e[0] = t[0]),
              (e[1] = t[1]),
              (e[2] = 0),
              (e[3] = t[2]),
              (e[4] = t[3]),
              (e[5] = 0),
              (e[6] = t[4]),
              (e[7] = t[5]),
              (e[8] = 1),
              e
            );
          }
          function Ie(e, t) {
            var r = t[0],
              n = t[1],
              a = t[2],
              i = t[3],
              s = r + r,
              o = n + n,
              c = a + a,
              u = r * s,
              _ = n * s,
              l = n * o,
              f = a * s,
              h = a * o,
              d = a * c,
              p = i * s,
              m = i * o,
              b = i * c;
            return (
              (e[0] = 1 - l - d),
              (e[3] = _ - b),
              (e[6] = f + m),
              (e[1] = _ + b),
              (e[4] = 1 - u - d),
              (e[7] = h - p),
              (e[2] = f - m),
              (e[5] = h + p),
              (e[8] = 1 - u - l),
              e
            );
          }
          function De(e, t) {
            var r = t[0],
              n = t[1],
              a = t[2],
              i = t[3],
              s = t[4],
              o = t[5],
              c = t[6],
              u = t[7],
              _ = t[8],
              l = t[9],
              f = t[10],
              h = t[11],
              d = t[12],
              p = t[13],
              m = t[14],
              b = t[15],
              g = r * o - n * s,
              y = r * c - a * s,
              v = r * u - i * s,
              w = n * c - a * o,
              M = n * u - i * o,
              x = a * u - i * c,
              E = _ * p - l * d,
              k = _ * m - f * d,
              A = _ * b - h * d,
              T = l * m - f * p,
              z = l * b - h * p,
              S = f * b - h * m,
              F = g * S - y * z + v * T + w * A - M * k + x * E;
            return F
              ? ((F = 1 / F),
                (e[0] = (o * S - c * z + u * T) * F),
                (e[1] = (c * A - s * S - u * k) * F),
                (e[2] = (s * z - o * A + u * E) * F),
                (e[3] = (a * z - n * S - i * T) * F),
                (e[4] = (r * S - a * A + i * k) * F),
                (e[5] = (n * A - r * z - i * E) * F),
                (e[6] = (p * x - m * M + b * w) * F),
                (e[7] = (m * v - d * x - b * y) * F),
                (e[8] = (d * M - p * v + b * g) * F),
                e)
              : null;
          }
          function Be(e, t, r) {
            return (
              (e[0] = 2 / t),
              (e[1] = 0),
              (e[2] = 0),
              (e[3] = 0),
              (e[4] = -2 / r),
              (e[5] = 0),
              (e[6] = -1),
              (e[7] = 1),
              (e[8] = 1),
              e
            );
          }
          function je(e) {
            return (
              "mat3(" +
              e[0] +
              ", " +
              e[1] +
              ", " +
              e[2] +
              ", " +
              e[3] +
              ", " +
              e[4] +
              ", " +
              e[5] +
              ", " +
              e[6] +
              ", " +
              e[7] +
              ", " +
              e[8] +
              ")"
            );
          }
          function Ue(e) {
            return Math.hypot(
              e[0],
              e[1],
              e[2],
              e[3],
              e[4],
              e[5],
              e[6],
              e[7],
              e[8]
            );
          }
          function Ve(e, t, r) {
            return (
              (e[0] = t[0] + r[0]),
              (e[1] = t[1] + r[1]),
              (e[2] = t[2] + r[2]),
              (e[3] = t[3] + r[3]),
              (e[4] = t[4] + r[4]),
              (e[5] = t[5] + r[5]),
              (e[6] = t[6] + r[6]),
              (e[7] = t[7] + r[7]),
              (e[8] = t[8] + r[8]),
              e
            );
          }
          function Ne(e, t, r) {
            return (
              (e[0] = t[0] - r[0]),
              (e[1] = t[1] - r[1]),
              (e[2] = t[2] - r[2]),
              (e[3] = t[3] - r[3]),
              (e[4] = t[4] - r[4]),
              (e[5] = t[5] - r[5]),
              (e[6] = t[6] - r[6]),
              (e[7] = t[7] - r[7]),
              (e[8] = t[8] - r[8]),
              e
            );
          }
          function Ge(e, t, r) {
            return (
              (e[0] = t[0] * r),
              (e[1] = t[1] * r),
              (e[2] = t[2] * r),
              (e[3] = t[3] * r),
              (e[4] = t[4] * r),
              (e[5] = t[5] * r),
              (e[6] = t[6] * r),
              (e[7] = t[7] * r),
              (e[8] = t[8] * r),
              e
            );
          }
          function qe(e, t, r, n) {
            return (
              (e[0] = t[0] + r[0] * n),
              (e[1] = t[1] + r[1] * n),
              (e[2] = t[2] + r[2] * n),
              (e[3] = t[3] + r[3] * n),
              (e[4] = t[4] + r[4] * n),
              (e[5] = t[5] + r[5] * n),
              (e[6] = t[6] + r[6] * n),
              (e[7] = t[7] + r[7] * n),
              (e[8] = t[8] + r[8] * n),
              e
            );
          }
          function He(e, t) {
            return (
              e[0] === t[0] &&
              e[1] === t[1] &&
              e[2] === t[2] &&
              e[3] === t[3] &&
              e[4] === t[4] &&
              e[5] === t[5] &&
              e[6] === t[6] &&
              e[7] === t[7] &&
              e[8] === t[8]
            );
          }
          function We(e, t) {
            var r = e[0],
              n = e[1],
              a = e[2],
              i = e[3],
              s = e[4],
              o = e[5],
              c = e[6],
              u = e[7],
              _ = e[8],
              l = t[0],
              f = t[1],
              d = t[2],
              p = t[3],
              m = t[4],
              b = t[5],
              g = t[6],
              y = t[7],
              v = t[8];
            return (
              Math.abs(r - l) <= h * Math.max(1, Math.abs(r), Math.abs(l)) &&
              Math.abs(n - f) <= h * Math.max(1, Math.abs(n), Math.abs(f)) &&
              Math.abs(a - d) <= h * Math.max(1, Math.abs(a), Math.abs(d)) &&
              Math.abs(i - p) <= h * Math.max(1, Math.abs(i), Math.abs(p)) &&
              Math.abs(s - m) <= h * Math.max(1, Math.abs(s), Math.abs(m)) &&
              Math.abs(o - b) <= h * Math.max(1, Math.abs(o), Math.abs(b)) &&
              Math.abs(c - g) <= h * Math.max(1, Math.abs(c), Math.abs(g)) &&
              Math.abs(u - y) <= h * Math.max(1, Math.abs(u), Math.abs(y)) &&
              Math.abs(_ - v) <= h * Math.max(1, Math.abs(_), Math.abs(v))
            );
          }
          var Ye = ze,
            Xe = Ne;
          function Ze() {
            var e = new d(16);
            return (
              d != Float32Array &&
                ((e[1] = 0),
                (e[2] = 0),
                (e[3] = 0),
                (e[4] = 0),
                (e[6] = 0),
                (e[7] = 0),
                (e[8] = 0),
                (e[9] = 0),
                (e[11] = 0),
                (e[12] = 0),
                (e[13] = 0),
                (e[14] = 0)),
              (e[0] = 1),
              (e[5] = 1),
              (e[10] = 1),
              (e[15] = 1),
              e
            );
          }
          function Ke(e) {
            var t = new d(16);
            return (
              (t[0] = e[0]),
              (t[1] = e[1]),
              (t[2] = e[2]),
              (t[3] = e[3]),
              (t[4] = e[4]),
              (t[5] = e[5]),
              (t[6] = e[6]),
              (t[7] = e[7]),
              (t[8] = e[8]),
              (t[9] = e[9]),
              (t[10] = e[10]),
              (t[11] = e[11]),
              (t[12] = e[12]),
              (t[13] = e[13]),
              (t[14] = e[14]),
              (t[15] = e[15]),
              t
            );
          }
          function $e(e, t) {
            return (
              (e[0] = t[0]),
              (e[1] = t[1]),
              (e[2] = t[2]),
              (e[3] = t[3]),
              (e[4] = t[4]),
              (e[5] = t[5]),
              (e[6] = t[6]),
              (e[7] = t[7]),
              (e[8] = t[8]),
              (e[9] = t[9]),
              (e[10] = t[10]),
              (e[11] = t[11]),
              (e[12] = t[12]),
              (e[13] = t[13]),
              (e[14] = t[14]),
              (e[15] = t[15]),
              e
            );
          }
          function Qe(e, t, r, n, a, i, s, o, c, u, _, l, f, h, p, m) {
            var b = new d(16);
            return (
              (b[0] = e),
              (b[1] = t),
              (b[2] = r),
              (b[3] = n),
              (b[4] = a),
              (b[5] = i),
              (b[6] = s),
              (b[7] = o),
              (b[8] = c),
              (b[9] = u),
              (b[10] = _),
              (b[11] = l),
              (b[12] = f),
              (b[13] = h),
              (b[14] = p),
              (b[15] = m),
              b
            );
          }
          function Je(e, t, r, n, a, i, s, o, c, u, _, l, f, h, d, p, m) {
            return (
              (e[0] = t),
              (e[1] = r),
              (e[2] = n),
              (e[3] = a),
              (e[4] = i),
              (e[5] = s),
              (e[6] = o),
              (e[7] = c),
              (e[8] = u),
              (e[9] = _),
              (e[10] = l),
              (e[11] = f),
              (e[12] = h),
              (e[13] = d),
              (e[14] = p),
              (e[15] = m),
              e
            );
          }
          function et(e) {
            return (
              (e[0] = 1),
              (e[1] = 0),
              (e[2] = 0),
              (e[3] = 0),
              (e[4] = 0),
              (e[5] = 1),
              (e[6] = 0),
              (e[7] = 0),
              (e[8] = 0),
              (e[9] = 0),
              (e[10] = 1),
              (e[11] = 0),
              (e[12] = 0),
              (e[13] = 0),
              (e[14] = 0),
              (e[15] = 1),
              e
            );
          }
          function tt(e, t) {
            if (e === t) {
              var r = t[1],
                n = t[2],
                a = t[3],
                i = t[6],
                s = t[7],
                o = t[11];
              (e[1] = t[4]),
                (e[2] = t[8]),
                (e[3] = t[12]),
                (e[4] = r),
                (e[6] = t[9]),
                (e[7] = t[13]),
                (e[8] = n),
                (e[9] = i),
                (e[11] = t[14]),
                (e[12] = a),
                (e[13] = s),
                (e[14] = o);
            } else
              (e[0] = t[0]),
                (e[1] = t[4]),
                (e[2] = t[8]),
                (e[3] = t[12]),
                (e[4] = t[1]),
                (e[5] = t[5]),
                (e[6] = t[9]),
                (e[7] = t[13]),
                (e[8] = t[2]),
                (e[9] = t[6]),
                (e[10] = t[10]),
                (e[11] = t[14]),
                (e[12] = t[3]),
                (e[13] = t[7]),
                (e[14] = t[11]),
                (e[15] = t[15]);
            return e;
          }
          function rt(e, t) {
            var r = t[0],
              n = t[1],
              a = t[2],
              i = t[3],
              s = t[4],
              o = t[5],
              c = t[6],
              u = t[7],
              _ = t[8],
              l = t[9],
              f = t[10],
              h = t[11],
              d = t[12],
              p = t[13],
              m = t[14],
              b = t[15],
              g = r * o - n * s,
              y = r * c - a * s,
              v = r * u - i * s,
              w = n * c - a * o,
              M = n * u - i * o,
              x = a * u - i * c,
              E = _ * p - l * d,
              k = _ * m - f * d,
              A = _ * b - h * d,
              T = l * m - f * p,
              z = l * b - h * p,
              S = f * b - h * m,
              F = g * S - y * z + v * T + w * A - M * k + x * E;
            return F
              ? ((F = 1 / F),
                (e[0] = (o * S - c * z + u * T) * F),
                (e[1] = (a * z - n * S - i * T) * F),
                (e[2] = (p * x - m * M + b * w) * F),
                (e[3] = (f * M - l * x - h * w) * F),
                (e[4] = (c * A - s * S - u * k) * F),
                (e[5] = (r * S - a * A + i * k) * F),
                (e[6] = (m * v - d * x - b * y) * F),
                (e[7] = (_ * x - f * v + h * y) * F),
                (e[8] = (s * z - o * A + u * E) * F),
                (e[9] = (n * A - r * z - i * E) * F),
                (e[10] = (d * M - p * v + b * g) * F),
                (e[11] = (l * v - _ * M - h * g) * F),
                (e[12] = (o * k - s * T - c * E) * F),
                (e[13] = (r * T - n * k + a * E) * F),
                (e[14] = (p * y - d * w - m * g) * F),
                (e[15] = (_ * w - l * y + f * g) * F),
                e)
              : null;
          }
          function nt(e, t) {
            var r = t[0],
              n = t[1],
              a = t[2],
              i = t[3],
              s = t[4],
              o = t[5],
              c = t[6],
              u = t[7],
              _ = t[8],
              l = t[9],
              f = t[10],
              h = t[11],
              d = t[12],
              p = t[13],
              m = t[14],
              b = t[15];
            return (
              (e[0] =
                o * (f * b - h * m) -
                l * (c * b - u * m) +
                p * (c * h - u * f)),
              (e[1] = -(
                n * (f * b - h * m) -
                l * (a * b - i * m) +
                p * (a * h - i * f)
              )),
              (e[2] =
                n * (c * b - u * m) -
                o * (a * b - i * m) +
                p * (a * u - i * c)),
              (e[3] = -(
                n * (c * h - u * f) -
                o * (a * h - i * f) +
                l * (a * u - i * c)
              )),
              (e[4] = -(
                s * (f * b - h * m) -
                _ * (c * b - u * m) +
                d * (c * h - u * f)
              )),
              (e[5] =
                r * (f * b - h * m) -
                _ * (a * b - i * m) +
                d * (a * h - i * f)),
              (e[6] = -(
                r * (c * b - u * m) -
                s * (a * b - i * m) +
                d * (a * u - i * c)
              )),
              (e[7] =
                r * (c * h - u * f) -
                s * (a * h - i * f) +
                _ * (a * u - i * c)),
              (e[8] =
                s * (l * b - h * p) -
                _ * (o * b - u * p) +
                d * (o * h - u * l)),
              (e[9] = -(
                r * (l * b - h * p) -
                _ * (n * b - i * p) +
                d * (n * h - i * l)
              )),
              (e[10] =
                r * (o * b - u * p) -
                s * (n * b - i * p) +
                d * (n * u - i * o)),
              (e[11] = -(
                r * (o * h - u * l) -
                s * (n * h - i * l) +
                _ * (n * u - i * o)
              )),
              (e[12] = -(
                s * (l * m - f * p) -
                _ * (o * m - c * p) +
                d * (o * f - c * l)
              )),
              (e[13] =
                r * (l * m - f * p) -
                _ * (n * m - a * p) +
                d * (n * f - a * l)),
              (e[14] = -(
                r * (o * m - c * p) -
                s * (n * m - a * p) +
                d * (n * c - a * o)
              )),
              (e[15] =
                r * (o * f - c * l) -
                s * (n * f - a * l) +
                _ * (n * c - a * o)),
              e
            );
          }
          function at(e) {
            var t = e[0],
              r = e[1],
              n = e[2],
              a = e[3],
              i = e[4],
              s = e[5],
              o = e[6],
              c = e[7],
              u = e[8],
              _ = e[9],
              l = e[10],
              f = e[11],
              h = e[12],
              d = e[13],
              p = e[14],
              m = e[15];
            return (
              (t * s - r * i) * (l * m - f * p) -
              (t * o - n * i) * (_ * m - f * d) +
              (t * c - a * i) * (_ * p - l * d) +
              (r * o - n * s) * (u * m - f * h) -
              (r * c - a * s) * (u * p - l * h) +
              (n * c - a * o) * (u * d - _ * h)
            );
          }
          function it(e, t, r) {
            var n = t[0],
              a = t[1],
              i = t[2],
              s = t[3],
              o = t[4],
              c = t[5],
              u = t[6],
              _ = t[7],
              l = t[8],
              f = t[9],
              h = t[10],
              d = t[11],
              p = t[12],
              m = t[13],
              b = t[14],
              g = t[15],
              y = r[0],
              v = r[1],
              w = r[2],
              M = r[3];
            return (
              (e[0] = y * n + v * o + w * l + M * p),
              (e[1] = y * a + v * c + w * f + M * m),
              (e[2] = y * i + v * u + w * h + M * b),
              (e[3] = y * s + v * _ + w * d + M * g),
              (y = r[4]),
              (v = r[5]),
              (w = r[6]),
              (M = r[7]),
              (e[4] = y * n + v * o + w * l + M * p),
              (e[5] = y * a + v * c + w * f + M * m),
              (e[6] = y * i + v * u + w * h + M * b),
              (e[7] = y * s + v * _ + w * d + M * g),
              (y = r[8]),
              (v = r[9]),
              (w = r[10]),
              (M = r[11]),
              (e[8] = y * n + v * o + w * l + M * p),
              (e[9] = y * a + v * c + w * f + M * m),
              (e[10] = y * i + v * u + w * h + M * b),
              (e[11] = y * s + v * _ + w * d + M * g),
              (y = r[12]),
              (v = r[13]),
              (w = r[14]),
              (M = r[15]),
              (e[12] = y * n + v * o + w * l + M * p),
              (e[13] = y * a + v * c + w * f + M * m),
              (e[14] = y * i + v * u + w * h + M * b),
              (e[15] = y * s + v * _ + w * d + M * g),
              e
            );
          }
          function st(e, t, r) {
            var n,
              a,
              i,
              s,
              o,
              c,
              u,
              _,
              l,
              f,
              h,
              d,
              p = r[0],
              m = r[1],
              b = r[2];
            return (
              t === e
                ? ((e[12] = t[0] * p + t[4] * m + t[8] * b + t[12]),
                  (e[13] = t[1] * p + t[5] * m + t[9] * b + t[13]),
                  (e[14] = t[2] * p + t[6] * m + t[10] * b + t[14]),
                  (e[15] = t[3] * p + t[7] * m + t[11] * b + t[15]))
                : ((n = t[0]),
                  (a = t[1]),
                  (i = t[2]),
                  (s = t[3]),
                  (o = t[4]),
                  (c = t[5]),
                  (u = t[6]),
                  (_ = t[7]),
                  (l = t[8]),
                  (f = t[9]),
                  (h = t[10]),
                  (d = t[11]),
                  (e[0] = n),
                  (e[1] = a),
                  (e[2] = i),
                  (e[3] = s),
                  (e[4] = o),
                  (e[5] = c),
                  (e[6] = u),
                  (e[7] = _),
                  (e[8] = l),
                  (e[9] = f),
                  (e[10] = h),
                  (e[11] = d),
                  (e[12] = n * p + o * m + l * b + t[12]),
                  (e[13] = a * p + c * m + f * b + t[13]),
                  (e[14] = i * p + u * m + h * b + t[14]),
                  (e[15] = s * p + _ * m + d * b + t[15])),
              e
            );
          }
          function ot(e, t, r) {
            var n = r[0],
              a = r[1],
              i = r[2];
            return (
              (e[0] = t[0] * n),
              (e[1] = t[1] * n),
              (e[2] = t[2] * n),
              (e[3] = t[3] * n),
              (e[4] = t[4] * a),
              (e[5] = t[5] * a),
              (e[6] = t[6] * a),
              (e[7] = t[7] * a),
              (e[8] = t[8] * i),
              (e[9] = t[9] * i),
              (e[10] = t[10] * i),
              (e[11] = t[11] * i),
              (e[12] = t[12]),
              (e[13] = t[13]),
              (e[14] = t[14]),
              (e[15] = t[15]),
              e
            );
          }
          function ct(e, t, r, n) {
            var a,
              i,
              s,
              o,
              c,
              u,
              _,
              l,
              f,
              d,
              p,
              m,
              b,
              g,
              y,
              v,
              w,
              M,
              x,
              E,
              k,
              A,
              T,
              z,
              S = n[0],
              F = n[1],
              L = n[2],
              C = Math.hypot(S, F, L);
            return C < h
              ? null
              : ((S *= C = 1 / C),
                (F *= C),
                (L *= C),
                (a = Math.sin(r)),
                (s = 1 - (i = Math.cos(r))),
                (o = t[0]),
                (c = t[1]),
                (u = t[2]),
                (_ = t[3]),
                (l = t[4]),
                (f = t[5]),
                (d = t[6]),
                (p = t[7]),
                (m = t[8]),
                (b = t[9]),
                (g = t[10]),
                (y = t[11]),
                (v = S * S * s + i),
                (w = F * S * s + L * a),
                (M = L * S * s - F * a),
                (x = S * F * s - L * a),
                (E = F * F * s + i),
                (k = L * F * s + S * a),
                (A = S * L * s + F * a),
                (T = F * L * s - S * a),
                (z = L * L * s + i),
                (e[0] = o * v + l * w + m * M),
                (e[1] = c * v + f * w + b * M),
                (e[2] = u * v + d * w + g * M),
                (e[3] = _ * v + p * w + y * M),
                (e[4] = o * x + l * E + m * k),
                (e[5] = c * x + f * E + b * k),
                (e[6] = u * x + d * E + g * k),
                (e[7] = _ * x + p * E + y * k),
                (e[8] = o * A + l * T + m * z),
                (e[9] = c * A + f * T + b * z),
                (e[10] = u * A + d * T + g * z),
                (e[11] = _ * A + p * T + y * z),
                t !== e &&
                  ((e[12] = t[12]),
                  (e[13] = t[13]),
                  (e[14] = t[14]),
                  (e[15] = t[15])),
                e);
          }
          function ut(e, t, r) {
            var n = Math.sin(r),
              a = Math.cos(r),
              i = t[4],
              s = t[5],
              o = t[6],
              c = t[7],
              u = t[8],
              _ = t[9],
              l = t[10],
              f = t[11];
            return (
              t !== e &&
                ((e[0] = t[0]),
                (e[1] = t[1]),
                (e[2] = t[2]),
                (e[3] = t[3]),
                (e[12] = t[12]),
                (e[13] = t[13]),
                (e[14] = t[14]),
                (e[15] = t[15])),
              (e[4] = i * a + u * n),
              (e[5] = s * a + _ * n),
              (e[6] = o * a + l * n),
              (e[7] = c * a + f * n),
              (e[8] = u * a - i * n),
              (e[9] = _ * a - s * n),
              (e[10] = l * a - o * n),
              (e[11] = f * a - c * n),
              e
            );
          }
          function _t(e, t, r) {
            var n = Math.sin(r),
              a = Math.cos(r),
              i = t[0],
              s = t[1],
              o = t[2],
              c = t[3],
              u = t[8],
              _ = t[9],
              l = t[10],
              f = t[11];
            return (
              t !== e &&
                ((e[4] = t[4]),
                (e[5] = t[5]),
                (e[6] = t[6]),
                (e[7] = t[7]),
                (e[12] = t[12]),
                (e[13] = t[13]),
                (e[14] = t[14]),
                (e[15] = t[15])),
              (e[0] = i * a - u * n),
              (e[1] = s * a - _ * n),
              (e[2] = o * a - l * n),
              (e[3] = c * a - f * n),
              (e[8] = i * n + u * a),
              (e[9] = s * n + _ * a),
              (e[10] = o * n + l * a),
              (e[11] = c * n + f * a),
              e
            );
          }
          function lt(e, t, r) {
            var n = Math.sin(r),
              a = Math.cos(r),
              i = t[0],
              s = t[1],
              o = t[2],
              c = t[3],
              u = t[4],
              _ = t[5],
              l = t[6],
              f = t[7];
            return (
              t !== e &&
                ((e[8] = t[8]),
                (e[9] = t[9]),
                (e[10] = t[10]),
                (e[11] = t[11]),
                (e[12] = t[12]),
                (e[13] = t[13]),
                (e[14] = t[14]),
                (e[15] = t[15])),
              (e[0] = i * a + u * n),
              (e[1] = s * a + _ * n),
              (e[2] = o * a + l * n),
              (e[3] = c * a + f * n),
              (e[4] = u * a - i * n),
              (e[5] = _ * a - s * n),
              (e[6] = l * a - o * n),
              (e[7] = f * a - c * n),
              e
            );
          }
          function ft(e, t) {
            return (
              (e[0] = 1),
              (e[1] = 0),
              (e[2] = 0),
              (e[3] = 0),
              (e[4] = 0),
              (e[5] = 1),
              (e[6] = 0),
              (e[7] = 0),
              (e[8] = 0),
              (e[9] = 0),
              (e[10] = 1),
              (e[11] = 0),
              (e[12] = t[0]),
              (e[13] = t[1]),
              (e[14] = t[2]),
              (e[15] = 1),
              e
            );
          }
          function ht(e, t) {
            return (
              (e[0] = t[0]),
              (e[1] = 0),
              (e[2] = 0),
              (e[3] = 0),
              (e[4] = 0),
              (e[5] = t[1]),
              (e[6] = 0),
              (e[7] = 0),
              (e[8] = 0),
              (e[9] = 0),
              (e[10] = t[2]),
              (e[11] = 0),
              (e[12] = 0),
              (e[13] = 0),
              (e[14] = 0),
              (e[15] = 1),
              e
            );
          }
          function dt(e, t, r) {
            var n,
              a,
              i,
              s = r[0],
              o = r[1],
              c = r[2],
              u = Math.hypot(s, o, c);
            return u < h
              ? null
              : ((s *= u = 1 / u),
                (o *= u),
                (c *= u),
                (n = Math.sin(t)),
                (i = 1 - (a = Math.cos(t))),
                (e[0] = s * s * i + a),
                (e[1] = o * s * i + c * n),
                (e[2] = c * s * i - o * n),
                (e[3] = 0),
                (e[4] = s * o * i - c * n),
                (e[5] = o * o * i + a),
                (e[6] = c * o * i + s * n),
                (e[7] = 0),
                (e[8] = s * c * i + o * n),
                (e[9] = o * c * i - s * n),
                (e[10] = c * c * i + a),
                (e[11] = 0),
                (e[12] = 0),
                (e[13] = 0),
                (e[14] = 0),
                (e[15] = 1),
                e);
          }
          function pt(e, t) {
            var r = Math.sin(t),
              n = Math.cos(t);
            return (
              (e[0] = 1),
              (e[1] = 0),
              (e[2] = 0),
              (e[3] = 0),
              (e[4] = 0),
              (e[5] = n),
              (e[6] = r),
              (e[7] = 0),
              (e[8] = 0),
              (e[9] = -r),
              (e[10] = n),
              (e[11] = 0),
              (e[12] = 0),
              (e[13] = 0),
              (e[14] = 0),
              (e[15] = 1),
              e
            );
          }
          function mt(e, t) {
            var r = Math.sin(t),
              n = Math.cos(t);
            return (
              (e[0] = n),
              (e[1] = 0),
              (e[2] = -r),
              (e[3] = 0),
              (e[4] = 0),
              (e[5] = 1),
              (e[6] = 0),
              (e[7] = 0),
              (e[8] = r),
              (e[9] = 0),
              (e[10] = n),
              (e[11] = 0),
              (e[12] = 0),
              (e[13] = 0),
              (e[14] = 0),
              (e[15] = 1),
              e
            );
          }
          function bt(e, t) {
            var r = Math.sin(t),
              n = Math.cos(t);
            return (
              (e[0] = n),
              (e[1] = r),
              (e[2] = 0),
              (e[3] = 0),
              (e[4] = -r),
              (e[5] = n),
              (e[6] = 0),
              (e[7] = 0),
              (e[8] = 0),
              (e[9] = 0),
              (e[10] = 1),
              (e[11] = 0),
              (e[12] = 0),
              (e[13] = 0),
              (e[14] = 0),
              (e[15] = 1),
              e
            );
          }
          function gt(e, t, r) {
            var n = t[0],
              a = t[1],
              i = t[2],
              s = t[3],
              o = n + n,
              c = a + a,
              u = i + i,
              _ = n * o,
              l = n * c,
              f = n * u,
              h = a * c,
              d = a * u,
              p = i * u,
              m = s * o,
              b = s * c,
              g = s * u;
            return (
              (e[0] = 1 - (h + p)),
              (e[1] = l + g),
              (e[2] = f - b),
              (e[3] = 0),
              (e[4] = l - g),
              (e[5] = 1 - (_ + p)),
              (e[6] = d + m),
              (e[7] = 0),
              (e[8] = f + b),
              (e[9] = d - m),
              (e[10] = 1 - (_ + h)),
              (e[11] = 0),
              (e[12] = r[0]),
              (e[13] = r[1]),
              (e[14] = r[2]),
              (e[15] = 1),
              e
            );
          }
          function yt(e, t) {
            var r = new d(3),
              n = -t[0],
              a = -t[1],
              i = -t[2],
              s = t[3],
              o = t[4],
              c = t[5],
              u = t[6],
              _ = t[7],
              l = n * n + a * a + i * i + s * s;
            return (
              l > 0
                ? ((r[0] = (2 * (o * s + _ * n + c * i - u * a)) / l),
                  (r[1] = (2 * (c * s + _ * a + u * n - o * i)) / l),
                  (r[2] = (2 * (u * s + _ * i + o * a - c * n)) / l))
                : ((r[0] = 2 * (o * s + _ * n + c * i - u * a)),
                  (r[1] = 2 * (c * s + _ * a + u * n - o * i)),
                  (r[2] = 2 * (u * s + _ * i + o * a - c * n))),
              gt(e, t, r),
              e
            );
          }
          function vt(e, t) {
            return (e[0] = t[12]), (e[1] = t[13]), (e[2] = t[14]), e;
          }
          function wt(e, t) {
            var r = t[0],
              n = t[1],
              a = t[2],
              i = t[4],
              s = t[5],
              o = t[6],
              c = t[8],
              u = t[9],
              _ = t[10];
            return (
              (e[0] = Math.hypot(r, n, a)),
              (e[1] = Math.hypot(i, s, o)),
              (e[2] = Math.hypot(c, u, _)),
              e
            );
          }
          function Mt(e, t) {
            var r = new d(3);
            wt(r, t);
            var n = 1 / r[0],
              a = 1 / r[1],
              i = 1 / r[2],
              s = t[0] * n,
              o = t[1] * a,
              c = t[2] * i,
              u = t[4] * n,
              _ = t[5] * a,
              l = t[6] * i,
              f = t[8] * n,
              h = t[9] * a,
              p = t[10] * i,
              m = s + _ + p,
              b = 0;
            return (
              m > 0
                ? ((b = 2 * Math.sqrt(m + 1)),
                  (e[3] = 0.25 * b),
                  (e[0] = (l - h) / b),
                  (e[1] = (f - c) / b),
                  (e[2] = (o - u) / b))
                : s > _ && s > p
                ? ((b = 2 * Math.sqrt(1 + s - _ - p)),
                  (e[3] = (l - h) / b),
                  (e[0] = 0.25 * b),
                  (e[1] = (o + u) / b),
                  (e[2] = (f + c) / b))
                : _ > p
                ? ((b = 2 * Math.sqrt(1 + _ - s - p)),
                  (e[3] = (f - c) / b),
                  (e[0] = (o + u) / b),
                  (e[1] = 0.25 * b),
                  (e[2] = (l + h) / b))
                : ((b = 2 * Math.sqrt(1 + p - s - _)),
                  (e[3] = (o - u) / b),
                  (e[0] = (f + c) / b),
                  (e[1] = (l + h) / b),
                  (e[2] = 0.25 * b)),
              e
            );
          }
          function xt(e, t, r, n) {
            var a = t[0],
              i = t[1],
              s = t[2],
              o = t[3],
              c = a + a,
              u = i + i,
              _ = s + s,
              l = a * c,
              f = a * u,
              h = a * _,
              d = i * u,
              p = i * _,
              m = s * _,
              b = o * c,
              g = o * u,
              y = o * _,
              v = n[0],
              w = n[1],
              M = n[2];
            return (
              (e[0] = (1 - (d + m)) * v),
              (e[1] = (f + y) * v),
              (e[2] = (h - g) * v),
              (e[3] = 0),
              (e[4] = (f - y) * w),
              (e[5] = (1 - (l + m)) * w),
              (e[6] = (p + b) * w),
              (e[7] = 0),
              (e[8] = (h + g) * M),
              (e[9] = (p - b) * M),
              (e[10] = (1 - (l + d)) * M),
              (e[11] = 0),
              (e[12] = r[0]),
              (e[13] = r[1]),
              (e[14] = r[2]),
              (e[15] = 1),
              e
            );
          }
          function Et(e, t, r, n, a) {
            var i = t[0],
              s = t[1],
              o = t[2],
              c = t[3],
              u = i + i,
              _ = s + s,
              l = o + o,
              f = i * u,
              h = i * _,
              d = i * l,
              p = s * _,
              m = s * l,
              b = o * l,
              g = c * u,
              y = c * _,
              v = c * l,
              w = n[0],
              M = n[1],
              x = n[2],
              E = a[0],
              k = a[1],
              A = a[2],
              T = (1 - (p + b)) * w,
              z = (h + v) * w,
              S = (d - y) * w,
              F = (h - v) * M,
              L = (1 - (f + b)) * M,
              C = (m + g) * M,
              R = (d + y) * x,
              O = (m - g) * x,
              P = (1 - (f + p)) * x;
            return (
              (e[0] = T),
              (e[1] = z),
              (e[2] = S),
              (e[3] = 0),
              (e[4] = F),
              (e[5] = L),
              (e[6] = C),
              (e[7] = 0),
              (e[8] = R),
              (e[9] = O),
              (e[10] = P),
              (e[11] = 0),
              (e[12] = r[0] + E - (T * E + F * k + R * A)),
              (e[13] = r[1] + k - (z * E + L * k + O * A)),
              (e[14] = r[2] + A - (S * E + C * k + P * A)),
              (e[15] = 1),
              e
            );
          }
          function kt(e, t) {
            var r = t[0],
              n = t[1],
              a = t[2],
              i = t[3],
              s = r + r,
              o = n + n,
              c = a + a,
              u = r * s,
              _ = n * s,
              l = n * o,
              f = a * s,
              h = a * o,
              d = a * c,
              p = i * s,
              m = i * o,
              b = i * c;
            return (
              (e[0] = 1 - l - d),
              (e[1] = _ + b),
              (e[2] = f - m),
              (e[3] = 0),
              (e[4] = _ - b),
              (e[5] = 1 - u - d),
              (e[6] = h + p),
              (e[7] = 0),
              (e[8] = f + m),
              (e[9] = h - p),
              (e[10] = 1 - u - l),
              (e[11] = 0),
              (e[12] = 0),
              (e[13] = 0),
              (e[14] = 0),
              (e[15] = 1),
              e
            );
          }
          function At(e, t, r, n, a, i, s) {
            var o = 1 / (r - t),
              c = 1 / (a - n),
              u = 1 / (i - s);
            return (
              (e[0] = 2 * i * o),
              (e[1] = 0),
              (e[2] = 0),
              (e[3] = 0),
              (e[4] = 0),
              (e[5] = 2 * i * c),
              (e[6] = 0),
              (e[7] = 0),
              (e[8] = (r + t) * o),
              (e[9] = (a + n) * c),
              (e[10] = (s + i) * u),
              (e[11] = -1),
              (e[12] = 0),
              (e[13] = 0),
              (e[14] = s * i * 2 * u),
              (e[15] = 0),
              e
            );
          }
          function Tt(e, t, r, n, a) {
            var i,
              s = 1 / Math.tan(t / 2);
            return (
              (e[0] = s / r),
              (e[1] = 0),
              (e[2] = 0),
              (e[3] = 0),
              (e[4] = 0),
              (e[5] = s),
              (e[6] = 0),
              (e[7] = 0),
              (e[8] = 0),
              (e[9] = 0),
              (e[11] = -1),
              (e[12] = 0),
              (e[13] = 0),
              (e[15] = 0),
              null != a && a !== 1 / 0
                ? ((i = 1 / (n - a)),
                  (e[10] = (a + n) * i),
                  (e[14] = 2 * a * n * i))
                : ((e[10] = -1), (e[14] = -2 * n)),
              e
            );
          }
          function zt(e, t, r, n) {
            var a = Math.tan((t.upDegrees * Math.PI) / 180),
              i = Math.tan((t.downDegrees * Math.PI) / 180),
              s = Math.tan((t.leftDegrees * Math.PI) / 180),
              o = Math.tan((t.rightDegrees * Math.PI) / 180),
              c = 2 / (s + o),
              u = 2 / (a + i);
            return (
              (e[0] = c),
              (e[1] = 0),
              (e[2] = 0),
              (e[3] = 0),
              (e[4] = 0),
              (e[5] = u),
              (e[6] = 0),
              (e[7] = 0),
              (e[8] = -(s - o) * c * 0.5),
              (e[9] = (a - i) * u * 0.5),
              (e[10] = n / (r - n)),
              (e[11] = -1),
              (e[12] = 0),
              (e[13] = 0),
              (e[14] = (n * r) / (r - n)),
              (e[15] = 0),
              e
            );
          }
          function St(e, t, r, n, a, i, s) {
            var o = 1 / (t - r),
              c = 1 / (n - a),
              u = 1 / (i - s);
            return (
              (e[0] = -2 * o),
              (e[1] = 0),
              (e[2] = 0),
              (e[3] = 0),
              (e[4] = 0),
              (e[5] = -2 * c),
              (e[6] = 0),
              (e[7] = 0),
              (e[8] = 0),
              (e[9] = 0),
              (e[10] = 2 * u),
              (e[11] = 0),
              (e[12] = (t + r) * o),
              (e[13] = (a + n) * c),
              (e[14] = (s + i) * u),
              (e[15] = 1),
              e
            );
          }
          function Ft(e, t, r, n) {
            var a,
              i,
              s,
              o,
              c,
              u,
              _,
              l,
              f,
              d,
              p = t[0],
              m = t[1],
              b = t[2],
              g = n[0],
              y = n[1],
              v = n[2],
              w = r[0],
              M = r[1],
              x = r[2];
            return Math.abs(p - w) < h &&
              Math.abs(m - M) < h &&
              Math.abs(b - x) < h
              ? et(e)
              : ((_ = p - w),
                (l = m - M),
                (f = b - x),
                (a = y * (f *= d = 1 / Math.hypot(_, l, f)) - v * (l *= d)),
                (i = v * (_ *= d) - g * f),
                (s = g * l - y * _),
                (d = Math.hypot(a, i, s))
                  ? ((a *= d = 1 / d), (i *= d), (s *= d))
                  : ((a = 0), (i = 0), (s = 0)),
                (o = l * s - f * i),
                (c = f * a - _ * s),
                (u = _ * i - l * a),
                (d = Math.hypot(o, c, u))
                  ? ((o *= d = 1 / d), (c *= d), (u *= d))
                  : ((o = 0), (c = 0), (u = 0)),
                (e[0] = a),
                (e[1] = o),
                (e[2] = _),
                (e[3] = 0),
                (e[4] = i),
                (e[5] = c),
                (e[6] = l),
                (e[7] = 0),
                (e[8] = s),
                (e[9] = u),
                (e[10] = f),
                (e[11] = 0),
                (e[12] = -(a * p + i * m + s * b)),
                (e[13] = -(o * p + c * m + u * b)),
                (e[14] = -(_ * p + l * m + f * b)),
                (e[15] = 1),
                e);
          }
          function Lt(e, t, r, n) {
            var a = t[0],
              i = t[1],
              s = t[2],
              o = n[0],
              c = n[1],
              u = n[2],
              _ = a - r[0],
              l = i - r[1],
              f = s - r[2],
              h = _ * _ + l * l + f * f;
            h > 0 && ((_ *= h = 1 / Math.sqrt(h)), (l *= h), (f *= h));
            var d = c * f - u * l,
              p = u * _ - o * f,
              m = o * l - c * _;
            return (
              (h = d * d + p * p + m * m) > 0 &&
                ((d *= h = 1 / Math.sqrt(h)), (p *= h), (m *= h)),
              (e[0] = d),
              (e[1] = p),
              (e[2] = m),
              (e[3] = 0),
              (e[4] = l * m - f * p),
              (e[5] = f * d - _ * m),
              (e[6] = _ * p - l * d),
              (e[7] = 0),
              (e[8] = _),
              (e[9] = l),
              (e[10] = f),
              (e[11] = 0),
              (e[12] = a),
              (e[13] = i),
              (e[14] = s),
              (e[15] = 1),
              e
            );
          }
          function Ct(e) {
            return (
              "mat4(" +
              e[0] +
              ", " +
              e[1] +
              ", " +
              e[2] +
              ", " +
              e[3] +
              ", " +
              e[4] +
              ", " +
              e[5] +
              ", " +
              e[6] +
              ", " +
              e[7] +
              ", " +
              e[8] +
              ", " +
              e[9] +
              ", " +
              e[10] +
              ", " +
              e[11] +
              ", " +
              e[12] +
              ", " +
              e[13] +
              ", " +
              e[14] +
              ", " +
              e[15] +
              ")"
            );
          }
          function Rt(e) {
            return Math.hypot(
              e[0],
              e[1],
              e[3],
              e[4],
              e[5],
              e[6],
              e[7],
              e[8],
              e[9],
              e[10],
              e[11],
              e[12],
              e[13],
              e[14],
              e[15]
            );
          }
          function Ot(e, t, r) {
            return (
              (e[0] = t[0] + r[0]),
              (e[1] = t[1] + r[1]),
              (e[2] = t[2] + r[2]),
              (e[3] = t[3] + r[3]),
              (e[4] = t[4] + r[4]),
              (e[5] = t[5] + r[5]),
              (e[6] = t[6] + r[6]),
              (e[7] = t[7] + r[7]),
              (e[8] = t[8] + r[8]),
              (e[9] = t[9] + r[9]),
              (e[10] = t[10] + r[10]),
              (e[11] = t[11] + r[11]),
              (e[12] = t[12] + r[12]),
              (e[13] = t[13] + r[13]),
              (e[14] = t[14] + r[14]),
              (e[15] = t[15] + r[15]),
              e
            );
          }
          function Pt(e, t, r) {
            return (
              (e[0] = t[0] - r[0]),
              (e[1] = t[1] - r[1]),
              (e[2] = t[2] - r[2]),
              (e[3] = t[3] - r[3]),
              (e[4] = t[4] - r[4]),
              (e[5] = t[5] - r[5]),
              (e[6] = t[6] - r[6]),
              (e[7] = t[7] - r[7]),
              (e[8] = t[8] - r[8]),
              (e[9] = t[9] - r[9]),
              (e[10] = t[10] - r[10]),
              (e[11] = t[11] - r[11]),
              (e[12] = t[12] - r[12]),
              (e[13] = t[13] - r[13]),
              (e[14] = t[14] - r[14]),
              (e[15] = t[15] - r[15]),
              e
            );
          }
          function It(e, t, r) {
            return (
              (e[0] = t[0] * r),
              (e[1] = t[1] * r),
              (e[2] = t[2] * r),
              (e[3] = t[3] * r),
              (e[4] = t[4] * r),
              (e[5] = t[5] * r),
              (e[6] = t[6] * r),
              (e[7] = t[7] * r),
              (e[8] = t[8] * r),
              (e[9] = t[9] * r),
              (e[10] = t[10] * r),
              (e[11] = t[11] * r),
              (e[12] = t[12] * r),
              (e[13] = t[13] * r),
              (e[14] = t[14] * r),
              (e[15] = t[15] * r),
              e
            );
          }
          function Dt(e, t, r, n) {
            return (
              (e[0] = t[0] + r[0] * n),
              (e[1] = t[1] + r[1] * n),
              (e[2] = t[2] + r[2] * n),
              (e[3] = t[3] + r[3] * n),
              (e[4] = t[4] + r[4] * n),
              (e[5] = t[5] + r[5] * n),
              (e[6] = t[6] + r[6] * n),
              (e[7] = t[7] + r[7] * n),
              (e[8] = t[8] + r[8] * n),
              (e[9] = t[9] + r[9] * n),
              (e[10] = t[10] + r[10] * n),
              (e[11] = t[11] + r[11] * n),
              (e[12] = t[12] + r[12] * n),
              (e[13] = t[13] + r[13] * n),
              (e[14] = t[14] + r[14] * n),
              (e[15] = t[15] + r[15] * n),
              e
            );
          }
          function Bt(e, t) {
            return (
              e[0] === t[0] &&
              e[1] === t[1] &&
              e[2] === t[2] &&
              e[3] === t[3] &&
              e[4] === t[4] &&
              e[5] === t[5] &&
              e[6] === t[6] &&
              e[7] === t[7] &&
              e[8] === t[8] &&
              e[9] === t[9] &&
              e[10] === t[10] &&
              e[11] === t[11] &&
              e[12] === t[12] &&
              e[13] === t[13] &&
              e[14] === t[14] &&
              e[15] === t[15]
            );
          }
          function jt(e, t) {
            var r = e[0],
              n = e[1],
              a = e[2],
              i = e[3],
              s = e[4],
              o = e[5],
              c = e[6],
              u = e[7],
              _ = e[8],
              l = e[9],
              f = e[10],
              d = e[11],
              p = e[12],
              m = e[13],
              b = e[14],
              g = e[15],
              y = t[0],
              v = t[1],
              w = t[2],
              M = t[3],
              x = t[4],
              E = t[5],
              k = t[6],
              A = t[7],
              T = t[8],
              z = t[9],
              S = t[10],
              F = t[11],
              L = t[12],
              C = t[13],
              R = t[14],
              O = t[15];
            return (
              Math.abs(r - y) <= h * Math.max(1, Math.abs(r), Math.abs(y)) &&
              Math.abs(n - v) <= h * Math.max(1, Math.abs(n), Math.abs(v)) &&
              Math.abs(a - w) <= h * Math.max(1, Math.abs(a), Math.abs(w)) &&
              Math.abs(i - M) <= h * Math.max(1, Math.abs(i), Math.abs(M)) &&
              Math.abs(s - x) <= h * Math.max(1, Math.abs(s), Math.abs(x)) &&
              Math.abs(o - E) <= h * Math.max(1, Math.abs(o), Math.abs(E)) &&
              Math.abs(c - k) <= h * Math.max(1, Math.abs(c), Math.abs(k)) &&
              Math.abs(u - A) <= h * Math.max(1, Math.abs(u), Math.abs(A)) &&
              Math.abs(_ - T) <= h * Math.max(1, Math.abs(_), Math.abs(T)) &&
              Math.abs(l - z) <= h * Math.max(1, Math.abs(l), Math.abs(z)) &&
              Math.abs(f - S) <= h * Math.max(1, Math.abs(f), Math.abs(S)) &&
              Math.abs(d - F) <= h * Math.max(1, Math.abs(d), Math.abs(F)) &&
              Math.abs(p - L) <= h * Math.max(1, Math.abs(p), Math.abs(L)) &&
              Math.abs(m - C) <= h * Math.max(1, Math.abs(m), Math.abs(C)) &&
              Math.abs(b - R) <= h * Math.max(1, Math.abs(b), Math.abs(R)) &&
              Math.abs(g - O) <= h * Math.max(1, Math.abs(g), Math.abs(O))
            );
          }
          var Ut = it,
            Vt = Pt;
          function Nt() {
            var e = new d(3);
            return d != Float32Array && ((e[0] = 0), (e[1] = 0), (e[2] = 0)), e;
          }
          function Gt(e) {
            var t = new d(3);
            return (t[0] = e[0]), (t[1] = e[1]), (t[2] = e[2]), t;
          }
          function qt(e) {
            var t = e[0],
              r = e[1],
              n = e[2];
            return Math.hypot(t, r, n);
          }
          function Ht(e, t, r) {
            var n = new d(3);
            return (n[0] = e), (n[1] = t), (n[2] = r), n;
          }
          function Wt(e, t) {
            return (e[0] = t[0]), (e[1] = t[1]), (e[2] = t[2]), e;
          }
          function Yt(e, t, r, n) {
            return (e[0] = t), (e[1] = r), (e[2] = n), e;
          }
          function Xt(e, t, r) {
            return (
              (e[0] = t[0] + r[0]),
              (e[1] = t[1] + r[1]),
              (e[2] = t[2] + r[2]),
              e
            );
          }
          function Zt(e, t, r) {
            return (
              (e[0] = t[0] - r[0]),
              (e[1] = t[1] - r[1]),
              (e[2] = t[2] - r[2]),
              e
            );
          }
          function Kt(e, t, r) {
            return (
              (e[0] = t[0] * r[0]),
              (e[1] = t[1] * r[1]),
              (e[2] = t[2] * r[2]),
              e
            );
          }
          function $t(e, t, r) {
            return (
              (e[0] = t[0] / r[0]),
              (e[1] = t[1] / r[1]),
              (e[2] = t[2] / r[2]),
              e
            );
          }
          function Qt(e, t) {
            return (
              (e[0] = Math.ceil(t[0])),
              (e[1] = Math.ceil(t[1])),
              (e[2] = Math.ceil(t[2])),
              e
            );
          }
          function Jt(e, t) {
            return (
              (e[0] = Math.floor(t[0])),
              (e[1] = Math.floor(t[1])),
              (e[2] = Math.floor(t[2])),
              e
            );
          }
          function er(e, t, r) {
            return (
              (e[0] = Math.min(t[0], r[0])),
              (e[1] = Math.min(t[1], r[1])),
              (e[2] = Math.min(t[2], r[2])),
              e
            );
          }
          function tr(e, t, r) {
            return (
              (e[0] = Math.max(t[0], r[0])),
              (e[1] = Math.max(t[1], r[1])),
              (e[2] = Math.max(t[2], r[2])),
              e
            );
          }
          function rr(e, t) {
            return (
              (e[0] = Math.round(t[0])),
              (e[1] = Math.round(t[1])),
              (e[2] = Math.round(t[2])),
              e
            );
          }
          function nr(e, t, r) {
            return (e[0] = t[0] * r), (e[1] = t[1] * r), (e[2] = t[2] * r), e;
          }
          function ar(e, t, r, n) {
            return (
              (e[0] = t[0] + r[0] * n),
              (e[1] = t[1] + r[1] * n),
              (e[2] = t[2] + r[2] * n),
              e
            );
          }
          function ir(e, t) {
            var r = t[0] - e[0],
              n = t[1] - e[1],
              a = t[2] - e[2];
            return Math.hypot(r, n, a);
          }
          function sr(e, t) {
            var r = t[0] - e[0],
              n = t[1] - e[1],
              a = t[2] - e[2];
            return r * r + n * n + a * a;
          }
          function or(e) {
            var t = e[0],
              r = e[1],
              n = e[2];
            return t * t + r * r + n * n;
          }
          function cr(e, t) {
            return (e[0] = -t[0]), (e[1] = -t[1]), (e[2] = -t[2]), e;
          }
          function ur(e, t) {
            return (e[0] = 1 / t[0]), (e[1] = 1 / t[1]), (e[2] = 1 / t[2]), e;
          }
          function _r(e, t) {
            var r = t[0],
              n = t[1],
              a = t[2],
              i = r * r + n * n + a * a;
            return (
              i > 0 && (i = 1 / Math.sqrt(i)),
              (e[0] = t[0] * i),
              (e[1] = t[1] * i),
              (e[2] = t[2] * i),
              e
            );
          }
          function lr(e, t) {
            return e[0] * t[0] + e[1] * t[1] + e[2] * t[2];
          }
          function fr(e, t, r) {
            var n = t[0],
              a = t[1],
              i = t[2],
              s = r[0],
              o = r[1],
              c = r[2];
            return (
              (e[0] = a * c - i * o),
              (e[1] = i * s - n * c),
              (e[2] = n * o - a * s),
              e
            );
          }
          function hr(e, t, r, n) {
            var a = t[0],
              i = t[1],
              s = t[2];
            return (
              (e[0] = a + n * (r[0] - a)),
              (e[1] = i + n * (r[1] - i)),
              (e[2] = s + n * (r[2] - s)),
              e
            );
          }
          function dr(e, t, r, n, a, i) {
            var s = i * i,
              o = s * (2 * i - 3) + 1,
              c = s * (i - 2) + i,
              u = s * (i - 1),
              _ = s * (3 - 2 * i);
            return (
              (e[0] = t[0] * o + r[0] * c + n[0] * u + a[0] * _),
              (e[1] = t[1] * o + r[1] * c + n[1] * u + a[1] * _),
              (e[2] = t[2] * o + r[2] * c + n[2] * u + a[2] * _),
              e
            );
          }
          function pr(e, t, r, n, a, i) {
            var s = 1 - i,
              o = s * s,
              c = i * i,
              u = o * s,
              _ = 3 * i * o,
              l = 3 * c * s,
              f = c * i;
            return (
              (e[0] = t[0] * u + r[0] * _ + n[0] * l + a[0] * f),
              (e[1] = t[1] * u + r[1] * _ + n[1] * l + a[1] * f),
              (e[2] = t[2] * u + r[2] * _ + n[2] * l + a[2] * f),
              e
            );
          }
          function mr(e, t) {
            t = t || 1;
            var r = 2 * p() * Math.PI,
              n = 2 * p() - 1,
              a = Math.sqrt(1 - n * n) * t;
            return (
              (e[0] = Math.cos(r) * a),
              (e[1] = Math.sin(r) * a),
              (e[2] = n * t),
              e
            );
          }
          function br(e, t, r) {
            var n = t[0],
              a = t[1],
              i = t[2],
              s = r[3] * n + r[7] * a + r[11] * i + r[15];
            return (
              (s = s || 1),
              (e[0] = (r[0] * n + r[4] * a + r[8] * i + r[12]) / s),
              (e[1] = (r[1] * n + r[5] * a + r[9] * i + r[13]) / s),
              (e[2] = (r[2] * n + r[6] * a + r[10] * i + r[14]) / s),
              e
            );
          }
          function gr(e, t, r) {
            var n = t[0],
              a = t[1],
              i = t[2];
            return (
              (e[0] = n * r[0] + a * r[3] + i * r[6]),
              (e[1] = n * r[1] + a * r[4] + i * r[7]),
              (e[2] = n * r[2] + a * r[5] + i * r[8]),
              e
            );
          }
          function yr(e, t, r) {
            var n = r[0],
              a = r[1],
              i = r[2],
              s = r[3],
              o = t[0],
              c = t[1],
              u = t[2],
              _ = a * u - i * c,
              l = i * o - n * u,
              f = n * c - a * o,
              h = a * f - i * l,
              d = i * _ - n * f,
              p = n * l - a * _,
              m = 2 * s;
            return (
              (_ *= m),
              (l *= m),
              (f *= m),
              (h *= 2),
              (d *= 2),
              (p *= 2),
              (e[0] = o + _ + h),
              (e[1] = c + l + d),
              (e[2] = u + f + p),
              e
            );
          }
          function vr(e, t, r, n) {
            var a = [],
              i = [];
            return (
              (a[0] = t[0] - r[0]),
              (a[1] = t[1] - r[1]),
              (a[2] = t[2] - r[2]),
              (i[0] = a[0]),
              (i[1] = a[1] * Math.cos(n) - a[2] * Math.sin(n)),
              (i[2] = a[1] * Math.sin(n) + a[2] * Math.cos(n)),
              (e[0] = i[0] + r[0]),
              (e[1] = i[1] + r[1]),
              (e[2] = i[2] + r[2]),
              e
            );
          }
          function wr(e, t, r, n) {
            var a = [],
              i = [];
            return (
              (a[0] = t[0] - r[0]),
              (a[1] = t[1] - r[1]),
              (a[2] = t[2] - r[2]),
              (i[0] = a[2] * Math.sin(n) + a[0] * Math.cos(n)),
              (i[1] = a[1]),
              (i[2] = a[2] * Math.cos(n) - a[0] * Math.sin(n)),
              (e[0] = i[0] + r[0]),
              (e[1] = i[1] + r[1]),
              (e[2] = i[2] + r[2]),
              e
            );
          }
          function Mr(e, t, r, n) {
            var a = [],
              i = [];
            return (
              (a[0] = t[0] - r[0]),
              (a[1] = t[1] - r[1]),
              (a[2] = t[2] - r[2]),
              (i[0] = a[0] * Math.cos(n) - a[1] * Math.sin(n)),
              (i[1] = a[0] * Math.sin(n) + a[1] * Math.cos(n)),
              (i[2] = a[2]),
              (e[0] = i[0] + r[0]),
              (e[1] = i[1] + r[1]),
              (e[2] = i[2] + r[2]),
              e
            );
          }
          function xr(e, t) {
            var r = Ht(e[0], e[1], e[2]),
              n = Ht(t[0], t[1], t[2]);
            _r(r, r), _r(n, n);
            var a = lr(r, n);
            return a > 1 ? 0 : a < -1 ? Math.PI : Math.acos(a);
          }
          function Er(e) {
            return (e[0] = 0), (e[1] = 0), (e[2] = 0), e;
          }
          function kr(e) {
            return "vec3(" + e[0] + ", " + e[1] + ", " + e[2] + ")";
          }
          function Ar(e, t) {
            return e[0] === t[0] && e[1] === t[1] && e[2] === t[2];
          }
          function Tr(e, t) {
            var r = e[0],
              n = e[1],
              a = e[2],
              i = t[0],
              s = t[1],
              o = t[2];
            return (
              Math.abs(r - i) <= h * Math.max(1, Math.abs(r), Math.abs(i)) &&
              Math.abs(n - s) <= h * Math.max(1, Math.abs(n), Math.abs(s)) &&
              Math.abs(a - o) <= h * Math.max(1, Math.abs(a), Math.abs(o))
            );
          }
          var zr,
            Sr = Zt,
            Fr = Kt,
            Lr = $t,
            Cr = ir,
            Rr = sr,
            Or = qt,
            Pr = or,
            Ir =
              ((zr = Nt()),
              function (e, t, r, n, a, i) {
                var s, o;
                for (
                  t || (t = 3),
                    r || (r = 0),
                    o = n ? Math.min(n * t + r, e.length) : e.length,
                    s = r;
                  s < o;
                  s += t
                )
                  (zr[0] = e[s]),
                    (zr[1] = e[s + 1]),
                    (zr[2] = e[s + 2]),
                    a(zr, zr, i),
                    (e[s] = zr[0]),
                    (e[s + 1] = zr[1]),
                    (e[s + 2] = zr[2]);
                return e;
              });
          function Dr() {
            var e = new d(4);
            return (
              d != Float32Array &&
                ((e[0] = 0), (e[1] = 0), (e[2] = 0), (e[3] = 0)),
              e
            );
          }
          function Br(e) {
            var t = new d(4);
            return (
              (t[0] = e[0]), (t[1] = e[1]), (t[2] = e[2]), (t[3] = e[3]), t
            );
          }
          function jr(e, t, r, n) {
            var a = new d(4);
            return (a[0] = e), (a[1] = t), (a[2] = r), (a[3] = n), a;
          }
          function Ur(e, t) {
            return (
              (e[0] = t[0]), (e[1] = t[1]), (e[2] = t[2]), (e[3] = t[3]), e
            );
          }
          function Vr(e, t, r, n, a) {
            return (e[0] = t), (e[1] = r), (e[2] = n), (e[3] = a), e;
          }
          function Nr(e, t, r) {
            return (
              (e[0] = t[0] + r[0]),
              (e[1] = t[1] + r[1]),
              (e[2] = t[2] + r[2]),
              (e[3] = t[3] + r[3]),
              e
            );
          }
          function Gr(e, t, r) {
            return (
              (e[0] = t[0] - r[0]),
              (e[1] = t[1] - r[1]),
              (e[2] = t[2] - r[2]),
              (e[3] = t[3] - r[3]),
              e
            );
          }
          function qr(e, t, r) {
            return (
              (e[0] = t[0] * r[0]),
              (e[1] = t[1] * r[1]),
              (e[2] = t[2] * r[2]),
              (e[3] = t[3] * r[3]),
              e
            );
          }
          function Hr(e, t, r) {
            return (
              (e[0] = t[0] / r[0]),
              (e[1] = t[1] / r[1]),
              (e[2] = t[2] / r[2]),
              (e[3] = t[3] / r[3]),
              e
            );
          }
          function Wr(e, t) {
            return (
              (e[0] = Math.ceil(t[0])),
              (e[1] = Math.ceil(t[1])),
              (e[2] = Math.ceil(t[2])),
              (e[3] = Math.ceil(t[3])),
              e
            );
          }
          function Yr(e, t) {
            return (
              (e[0] = Math.floor(t[0])),
              (e[1] = Math.floor(t[1])),
              (e[2] = Math.floor(t[2])),
              (e[3] = Math.floor(t[3])),
              e
            );
          }
          function Xr(e, t, r) {
            return (
              (e[0] = Math.min(t[0], r[0])),
              (e[1] = Math.min(t[1], r[1])),
              (e[2] = Math.min(t[2], r[2])),
              (e[3] = Math.min(t[3], r[3])),
              e
            );
          }
          function Zr(e, t, r) {
            return (
              (e[0] = Math.max(t[0], r[0])),
              (e[1] = Math.max(t[1], r[1])),
              (e[2] = Math.max(t[2], r[2])),
              (e[3] = Math.max(t[3], r[3])),
              e
            );
          }
          function Kr(e, t) {
            return (
              (e[0] = Math.round(t[0])),
              (e[1] = Math.round(t[1])),
              (e[2] = Math.round(t[2])),
              (e[3] = Math.round(t[3])),
              e
            );
          }
          function $r(e, t, r) {
            return (
              (e[0] = t[0] * r),
              (e[1] = t[1] * r),
              (e[2] = t[2] * r),
              (e[3] = t[3] * r),
              e
            );
          }
          function Qr(e, t, r, n) {
            return (
              (e[0] = t[0] + r[0] * n),
              (e[1] = t[1] + r[1] * n),
              (e[2] = t[2] + r[2] * n),
              (e[3] = t[3] + r[3] * n),
              e
            );
          }
          function Jr(e, t) {
            var r = t[0] - e[0],
              n = t[1] - e[1],
              a = t[2] - e[2],
              i = t[3] - e[3];
            return Math.hypot(r, n, a, i);
          }
          function en(e, t) {
            var r = t[0] - e[0],
              n = t[1] - e[1],
              a = t[2] - e[2],
              i = t[3] - e[3];
            return r * r + n * n + a * a + i * i;
          }
          function tn(e) {
            var t = e[0],
              r = e[1],
              n = e[2],
              a = e[3];
            return Math.hypot(t, r, n, a);
          }
          function rn(e) {
            var t = e[0],
              r = e[1],
              n = e[2],
              a = e[3];
            return t * t + r * r + n * n + a * a;
          }
          function nn(e, t) {
            return (
              (e[0] = -t[0]), (e[1] = -t[1]), (e[2] = -t[2]), (e[3] = -t[3]), e
            );
          }
          function an(e, t) {
            return (
              (e[0] = 1 / t[0]),
              (e[1] = 1 / t[1]),
              (e[2] = 1 / t[2]),
              (e[3] = 1 / t[3]),
              e
            );
          }
          function sn(e, t) {
            var r = t[0],
              n = t[1],
              a = t[2],
              i = t[3],
              s = r * r + n * n + a * a + i * i;
            return (
              s > 0 && (s = 1 / Math.sqrt(s)),
              (e[0] = r * s),
              (e[1] = n * s),
              (e[2] = a * s),
              (e[3] = i * s),
              e
            );
          }
          function on(e, t) {
            return e[0] * t[0] + e[1] * t[1] + e[2] * t[2] + e[3] * t[3];
          }
          function cn(e, t, r, n) {
            var a = r[0] * n[1] - r[1] * n[0],
              i = r[0] * n[2] - r[2] * n[0],
              s = r[0] * n[3] - r[3] * n[0],
              o = r[1] * n[2] - r[2] * n[1],
              c = r[1] * n[3] - r[3] * n[1],
              u = r[2] * n[3] - r[3] * n[2],
              _ = t[0],
              l = t[1],
              f = t[2],
              h = t[3];
            return (
              (e[0] = l * u - f * c + h * o),
              (e[1] = -_ * u + f * s - h * i),
              (e[2] = _ * c - l * s + h * a),
              (e[3] = -_ * o + l * i - f * a),
              e
            );
          }
          function un(e, t, r, n) {
            var a = t[0],
              i = t[1],
              s = t[2],
              o = t[3];
            return (
              (e[0] = a + n * (r[0] - a)),
              (e[1] = i + n * (r[1] - i)),
              (e[2] = s + n * (r[2] - s)),
              (e[3] = o + n * (r[3] - o)),
              e
            );
          }
          function _n(e, t) {
            var r, n, a, i, s, o;
            t = t || 1;
            do {
              s = (r = 2 * p() - 1) * r + (n = 2 * p() - 1) * n;
            } while (s >= 1);
            do {
              o = (a = 2 * p() - 1) * a + (i = 2 * p() - 1) * i;
            } while (o >= 1);
            var c = Math.sqrt((1 - s) / o);
            return (
              (e[0] = t * r),
              (e[1] = t * n),
              (e[2] = t * a * c),
              (e[3] = t * i * c),
              e
            );
          }
          function ln(e, t, r) {
            var n = t[0],
              a = t[1],
              i = t[2],
              s = t[3];
            return (
              (e[0] = r[0] * n + r[4] * a + r[8] * i + r[12] * s),
              (e[1] = r[1] * n + r[5] * a + r[9] * i + r[13] * s),
              (e[2] = r[2] * n + r[6] * a + r[10] * i + r[14] * s),
              (e[3] = r[3] * n + r[7] * a + r[11] * i + r[15] * s),
              e
            );
          }
          function fn(e, t, r) {
            var n = t[0],
              a = t[1],
              i = t[2],
              s = r[0],
              o = r[1],
              c = r[2],
              u = r[3],
              _ = u * n + o * i - c * a,
              l = u * a + c * n - s * i,
              f = u * i + s * a - o * n,
              h = -s * n - o * a - c * i;
            return (
              (e[0] = _ * u + h * -s + l * -c - f * -o),
              (e[1] = l * u + h * -o + f * -s - _ * -c),
              (e[2] = f * u + h * -c + _ * -o - l * -s),
              (e[3] = t[3]),
              e
            );
          }
          function hn(e) {
            return (e[0] = 0), (e[1] = 0), (e[2] = 0), (e[3] = 0), e;
          }
          function dn(e) {
            return (
              "vec4(" + e[0] + ", " + e[1] + ", " + e[2] + ", " + e[3] + ")"
            );
          }
          function pn(e, t) {
            return (
              e[0] === t[0] && e[1] === t[1] && e[2] === t[2] && e[3] === t[3]
            );
          }
          function mn(e, t) {
            var r = e[0],
              n = e[1],
              a = e[2],
              i = e[3],
              s = t[0],
              o = t[1],
              c = t[2],
              u = t[3];
            return (
              Math.abs(r - s) <= h * Math.max(1, Math.abs(r), Math.abs(s)) &&
              Math.abs(n - o) <= h * Math.max(1, Math.abs(n), Math.abs(o)) &&
              Math.abs(a - c) <= h * Math.max(1, Math.abs(a), Math.abs(c)) &&
              Math.abs(i - u) <= h * Math.max(1, Math.abs(i), Math.abs(u))
            );
          }
          var bn = Gr,
            gn = qr,
            yn = Hr,
            vn = Jr,
            wn = en,
            Mn = tn,
            xn = rn,
            En = (function () {
              var e = Dr();
              return function (t, r, n, a, i, s) {
                var o, c;
                for (
                  r || (r = 4),
                    n || (n = 0),
                    c = a ? Math.min(a * r + n, t.length) : t.length,
                    o = n;
                  o < c;
                  o += r
                )
                  (e[0] = t[o]),
                    (e[1] = t[o + 1]),
                    (e[2] = t[o + 2]),
                    (e[3] = t[o + 3]),
                    i(e, e, s),
                    (t[o] = e[0]),
                    (t[o + 1] = e[1]),
                    (t[o + 2] = e[2]),
                    (t[o + 3] = e[3]);
                return t;
              };
            })();
          function kn() {
            var e = new d(4);
            return (
              d != Float32Array && ((e[0] = 0), (e[1] = 0), (e[2] = 0)),
              (e[3] = 1),
              e
            );
          }
          function An(e) {
            return (e[0] = 0), (e[1] = 0), (e[2] = 0), (e[3] = 1), e;
          }
          function Tn(e, t, r) {
            r *= 0.5;
            var n = Math.sin(r);
            return (
              (e[0] = n * t[0]),
              (e[1] = n * t[1]),
              (e[2] = n * t[2]),
              (e[3] = Math.cos(r)),
              e
            );
          }
          function zn(e, t) {
            var r = 2 * Math.acos(t[3]),
              n = Math.sin(r / 2);
            return (
              n > h
                ? ((e[0] = t[0] / n), (e[1] = t[1] / n), (e[2] = t[2] / n))
                : ((e[0] = 1), (e[1] = 0), (e[2] = 0)),
              r
            );
          }
          function Sn(e, t) {
            var r = aa(e, t);
            return Math.acos(2 * r * r - 1);
          }
          function Fn(e, t, r) {
            var n = t[0],
              a = t[1],
              i = t[2],
              s = t[3],
              o = r[0],
              c = r[1],
              u = r[2],
              _ = r[3];
            return (
              (e[0] = n * _ + s * o + a * u - i * c),
              (e[1] = a * _ + s * c + i * o - n * u),
              (e[2] = i * _ + s * u + n * c - a * o),
              (e[3] = s * _ - n * o - a * c - i * u),
              e
            );
          }
          function Ln(e, t, r) {
            r *= 0.5;
            var n = t[0],
              a = t[1],
              i = t[2],
              s = t[3],
              o = Math.sin(r),
              c = Math.cos(r);
            return (
              (e[0] = n * c + s * o),
              (e[1] = a * c + i * o),
              (e[2] = i * c - a * o),
              (e[3] = s * c - n * o),
              e
            );
          }
          function Cn(e, t, r) {
            r *= 0.5;
            var n = t[0],
              a = t[1],
              i = t[2],
              s = t[3],
              o = Math.sin(r),
              c = Math.cos(r);
            return (
              (e[0] = n * c - i * o),
              (e[1] = a * c + s * o),
              (e[2] = i * c + n * o),
              (e[3] = s * c - a * o),
              e
            );
          }
          function Rn(e, t, r) {
            r *= 0.5;
            var n = t[0],
              a = t[1],
              i = t[2],
              s = t[3],
              o = Math.sin(r),
              c = Math.cos(r);
            return (
              (e[0] = n * c + a * o),
              (e[1] = a * c - n * o),
              (e[2] = i * c + s * o),
              (e[3] = s * c - i * o),
              e
            );
          }
          function On(e, t) {
            var r = t[0],
              n = t[1],
              a = t[2];
            return (
              (e[0] = r),
              (e[1] = n),
              (e[2] = a),
              (e[3] = Math.sqrt(Math.abs(1 - r * r - n * n - a * a))),
              e
            );
          }
          function Pn(e, t) {
            var r = t[0],
              n = t[1],
              a = t[2],
              i = t[3],
              s = Math.sqrt(r * r + n * n + a * a),
              o = Math.exp(i),
              c = s > 0 ? (o * Math.sin(s)) / s : 0;
            return (
              (e[0] = r * c),
              (e[1] = n * c),
              (e[2] = a * c),
              (e[3] = o * Math.cos(s)),
              e
            );
          }
          function In(e, t) {
            var r = t[0],
              n = t[1],
              a = t[2],
              i = t[3],
              s = Math.sqrt(r * r + n * n + a * a),
              o = s > 0 ? Math.atan2(s, i) / s : 0;
            return (
              (e[0] = r * o),
              (e[1] = n * o),
              (e[2] = a * o),
              (e[3] = 0.5 * Math.log(r * r + n * n + a * a + i * i)),
              e
            );
          }
          function Dn(e, t, r) {
            return In(e, t), na(e, e, r), Pn(e, e), e;
          }
          function Bn(e, t, r, n) {
            var a,
              i,
              s,
              o,
              c,
              u = t[0],
              _ = t[1],
              l = t[2],
              f = t[3],
              d = r[0],
              p = r[1],
              m = r[2],
              b = r[3];
            return (
              (i = u * d + _ * p + l * m + f * b) < 0 &&
                ((i = -i), (d = -d), (p = -p), (m = -m), (b = -b)),
              1 - i > h
                ? ((a = Math.acos(i)),
                  (s = Math.sin(a)),
                  (o = Math.sin((1 - n) * a) / s),
                  (c = Math.sin(n * a) / s))
                : ((o = 1 - n), (c = n)),
              (e[0] = o * u + c * d),
              (e[1] = o * _ + c * p),
              (e[2] = o * l + c * m),
              (e[3] = o * f + c * b),
              e
            );
          }
          function jn(e) {
            var t = p(),
              r = p(),
              n = p(),
              a = Math.sqrt(1 - t),
              i = Math.sqrt(t);
            return (
              (e[0] = a * Math.sin(2 * Math.PI * r)),
              (e[1] = a * Math.cos(2 * Math.PI * r)),
              (e[2] = i * Math.sin(2 * Math.PI * n)),
              (e[3] = i * Math.cos(2 * Math.PI * n)),
              e
            );
          }
          function Un(e, t) {
            var r = t[0],
              n = t[1],
              a = t[2],
              i = t[3],
              s = r * r + n * n + a * a + i * i,
              o = s ? 1 / s : 0;
            return (
              (e[0] = -r * o),
              (e[1] = -n * o),
              (e[2] = -a * o),
              (e[3] = i * o),
              e
            );
          }
          function Vn(e, t) {
            return (
              (e[0] = -t[0]), (e[1] = -t[1]), (e[2] = -t[2]), (e[3] = t[3]), e
            );
          }
          function Nn(e, t) {
            var r,
              n = t[0] + t[4] + t[8];
            if (n > 0)
              (r = Math.sqrt(n + 1)),
                (e[3] = 0.5 * r),
                (r = 0.5 / r),
                (e[0] = (t[5] - t[7]) * r),
                (e[1] = (t[6] - t[2]) * r),
                (e[2] = (t[1] - t[3]) * r);
            else {
              var a = 0;
              t[4] > t[0] && (a = 1), t[8] > t[3 * a + a] && (a = 2);
              var i = (a + 1) % 3,
                s = (a + 2) % 3;
              (r = Math.sqrt(t[3 * a + a] - t[3 * i + i] - t[3 * s + s] + 1)),
                (e[a] = 0.5 * r),
                (r = 0.5 / r),
                (e[3] = (t[3 * i + s] - t[3 * s + i]) * r),
                (e[i] = (t[3 * i + a] + t[3 * a + i]) * r),
                (e[s] = (t[3 * s + a] + t[3 * a + s]) * r);
            }
            return e;
          }
          function Gn(e, t, r, n) {
            var a = (0.5 * Math.PI) / 180;
            (t *= a), (r *= a), (n *= a);
            var i = Math.sin(t),
              s = Math.cos(t),
              o = Math.sin(r),
              c = Math.cos(r),
              u = Math.sin(n),
              _ = Math.cos(n);
            return (
              (e[0] = i * c * _ - s * o * u),
              (e[1] = s * o * _ + i * c * u),
              (e[2] = s * c * u - i * o * _),
              (e[3] = s * c * _ + i * o * u),
              e
            );
          }
          function qn(e) {
            return (
              "quat(" + e[0] + ", " + e[1] + ", " + e[2] + ", " + e[3] + ")"
            );
          }
          var Hn,
            Wn,
            Yn,
            Xn,
            Zn,
            Kn,
            $n = Br,
            Qn = jr,
            Jn = Ur,
            ea = Vr,
            ta = Nr,
            ra = Fn,
            na = $r,
            aa = on,
            ia = un,
            sa = tn,
            oa = sa,
            ca = rn,
            ua = ca,
            _a = sn,
            la = pn,
            fa = mn,
            ha =
              ((Hn = Nt()),
              (Wn = Ht(1, 0, 0)),
              (Yn = Ht(0, 1, 0)),
              function (e, t, r) {
                var n = lr(t, r);
                return n < -0.999999
                  ? (fr(Hn, Wn, t),
                    Or(Hn) < 1e-6 && fr(Hn, Yn, t),
                    _r(Hn, Hn),
                    Tn(e, Hn, Math.PI),
                    e)
                  : n > 0.999999
                  ? ((e[0] = 0), (e[1] = 0), (e[2] = 0), (e[3] = 1), e)
                  : (fr(Hn, t, r),
                    (e[0] = Hn[0]),
                    (e[1] = Hn[1]),
                    (e[2] = Hn[2]),
                    (e[3] = 1 + n),
                    _a(e, e));
              }),
            da =
              ((Xn = kn()),
              (Zn = kn()),
              function (e, t, r, n, a, i) {
                return (
                  Bn(Xn, t, a, i),
                  Bn(Zn, r, n, i),
                  Bn(e, Xn, Zn, 2 * i * (1 - i)),
                  e
                );
              }),
            pa =
              ((Kn = be()),
              function (e, t, r, n) {
                return (
                  (Kn[0] = r[0]),
                  (Kn[3] = r[1]),
                  (Kn[6] = r[2]),
                  (Kn[1] = n[0]),
                  (Kn[4] = n[1]),
                  (Kn[7] = n[2]),
                  (Kn[2] = -t[0]),
                  (Kn[5] = -t[1]),
                  (Kn[8] = -t[2]),
                  _a(e, Nn(e, Kn))
                );
              });
          function ma() {
            var e = new d(8);
            return (
              d != Float32Array &&
                ((e[0] = 0),
                (e[1] = 0),
                (e[2] = 0),
                (e[4] = 0),
                (e[5] = 0),
                (e[6] = 0),
                (e[7] = 0)),
              (e[3] = 1),
              e
            );
          }
          function ba(e) {
            var t = new d(8);
            return (
              (t[0] = e[0]),
              (t[1] = e[1]),
              (t[2] = e[2]),
              (t[3] = e[3]),
              (t[4] = e[4]),
              (t[5] = e[5]),
              (t[6] = e[6]),
              (t[7] = e[7]),
              t
            );
          }
          function ga(e, t, r, n, a, i, s, o) {
            var c = new d(8);
            return (
              (c[0] = e),
              (c[1] = t),
              (c[2] = r),
              (c[3] = n),
              (c[4] = a),
              (c[5] = i),
              (c[6] = s),
              (c[7] = o),
              c
            );
          }
          function ya(e, t, r, n, a, i, s) {
            var o = new d(8);
            (o[0] = e), (o[1] = t), (o[2] = r), (o[3] = n);
            var c = 0.5 * a,
              u = 0.5 * i,
              _ = 0.5 * s;
            return (
              (o[4] = c * n + u * r - _ * t),
              (o[5] = u * n + _ * e - c * r),
              (o[6] = _ * n + c * t - u * e),
              (o[7] = -c * e - u * t - _ * r),
              o
            );
          }
          function va(e, t, r) {
            var n = 0.5 * r[0],
              a = 0.5 * r[1],
              i = 0.5 * r[2],
              s = t[0],
              o = t[1],
              c = t[2],
              u = t[3];
            return (
              (e[0] = s),
              (e[1] = o),
              (e[2] = c),
              (e[3] = u),
              (e[4] = n * u + a * c - i * o),
              (e[5] = a * u + i * s - n * c),
              (e[6] = i * u + n * o - a * s),
              (e[7] = -n * s - a * o - i * c),
              e
            );
          }
          function wa(e, t) {
            return (
              (e[0] = 0),
              (e[1] = 0),
              (e[2] = 0),
              (e[3] = 1),
              (e[4] = 0.5 * t[0]),
              (e[5] = 0.5 * t[1]),
              (e[6] = 0.5 * t[2]),
              (e[7] = 0),
              e
            );
          }
          function Ma(e, t) {
            return (
              (e[0] = t[0]),
              (e[1] = t[1]),
              (e[2] = t[2]),
              (e[3] = t[3]),
              (e[4] = 0),
              (e[5] = 0),
              (e[6] = 0),
              (e[7] = 0),
              e
            );
          }
          function xa(e, t) {
            var r = kn();
            Mt(r, t);
            var n = new d(3);
            return vt(n, t), va(e, r, n), e;
          }
          function Ea(e, t) {
            return (
              (e[0] = t[0]),
              (e[1] = t[1]),
              (e[2] = t[2]),
              (e[3] = t[3]),
              (e[4] = t[4]),
              (e[5] = t[5]),
              (e[6] = t[6]),
              (e[7] = t[7]),
              e
            );
          }
          function ka(e) {
            return (
              (e[0] = 0),
              (e[1] = 0),
              (e[2] = 0),
              (e[3] = 1),
              (e[4] = 0),
              (e[5] = 0),
              (e[6] = 0),
              (e[7] = 0),
              e
            );
          }
          function Aa(e, t, r, n, a, i, s, o, c) {
            return (
              (e[0] = t),
              (e[1] = r),
              (e[2] = n),
              (e[3] = a),
              (e[4] = i),
              (e[5] = s),
              (e[6] = o),
              (e[7] = c),
              e
            );
          }
          var Ta = Jn;
          function za(e, t) {
            return (
              (e[0] = t[4]), (e[1] = t[5]), (e[2] = t[6]), (e[3] = t[7]), e
            );
          }
          var Sa = Jn;
          function Fa(e, t) {
            return (
              (e[4] = t[0]), (e[5] = t[1]), (e[6] = t[2]), (e[7] = t[3]), e
            );
          }
          function La(e, t) {
            var r = t[4],
              n = t[5],
              a = t[6],
              i = t[7],
              s = -t[0],
              o = -t[1],
              c = -t[2],
              u = t[3];
            return (
              (e[0] = 2 * (r * u + i * s + n * c - a * o)),
              (e[1] = 2 * (n * u + i * o + a * s - r * c)),
              (e[2] = 2 * (a * u + i * c + r * o - n * s)),
              e
            );
          }
          function Ca(e, t, r) {
            var n = t[0],
              a = t[1],
              i = t[2],
              s = t[3],
              o = 0.5 * r[0],
              c = 0.5 * r[1],
              u = 0.5 * r[2],
              _ = t[4],
              l = t[5],
              f = t[6],
              h = t[7];
            return (
              (e[0] = n),
              (e[1] = a),
              (e[2] = i),
              (e[3] = s),
              (e[4] = s * o + a * u - i * c + _),
              (e[5] = s * c + i * o - n * u + l),
              (e[6] = s * u + n * c - a * o + f),
              (e[7] = -n * o - a * c - i * u + h),
              e
            );
          }
          function Ra(e, t, r) {
            var n = -t[0],
              a = -t[1],
              i = -t[2],
              s = t[3],
              o = t[4],
              c = t[5],
              u = t[6],
              _ = t[7],
              l = o * s + _ * n + c * i - u * a,
              f = c * s + _ * a + u * n - o * i,
              h = u * s + _ * i + o * a - c * n,
              d = _ * s - o * n - c * a - u * i;
            return (
              Ln(e, t, r),
              (n = e[0]),
              (a = e[1]),
              (i = e[2]),
              (s = e[3]),
              (e[4] = l * s + d * n + f * i - h * a),
              (e[5] = f * s + d * a + h * n - l * i),
              (e[6] = h * s + d * i + l * a - f * n),
              (e[7] = d * s - l * n - f * a - h * i),
              e
            );
          }
          function Oa(e, t, r) {
            var n = -t[0],
              a = -t[1],
              i = -t[2],
              s = t[3],
              o = t[4],
              c = t[5],
              u = t[6],
              _ = t[7],
              l = o * s + _ * n + c * i - u * a,
              f = c * s + _ * a + u * n - o * i,
              h = u * s + _ * i + o * a - c * n,
              d = _ * s - o * n - c * a - u * i;
            return (
              Cn(e, t, r),
              (n = e[0]),
              (a = e[1]),
              (i = e[2]),
              (s = e[3]),
              (e[4] = l * s + d * n + f * i - h * a),
              (e[5] = f * s + d * a + h * n - l * i),
              (e[6] = h * s + d * i + l * a - f * n),
              (e[7] = d * s - l * n - f * a - h * i),
              e
            );
          }
          function Pa(e, t, r) {
            var n = -t[0],
              a = -t[1],
              i = -t[2],
              s = t[3],
              o = t[4],
              c = t[5],
              u = t[6],
              _ = t[7],
              l = o * s + _ * n + c * i - u * a,
              f = c * s + _ * a + u * n - o * i,
              h = u * s + _ * i + o * a - c * n,
              d = _ * s - o * n - c * a - u * i;
            return (
              Rn(e, t, r),
              (n = e[0]),
              (a = e[1]),
              (i = e[2]),
              (s = e[3]),
              (e[4] = l * s + d * n + f * i - h * a),
              (e[5] = f * s + d * a + h * n - l * i),
              (e[6] = h * s + d * i + l * a - f * n),
              (e[7] = d * s - l * n - f * a - h * i),
              e
            );
          }
          function Ia(e, t, r) {
            var n = r[0],
              a = r[1],
              i = r[2],
              s = r[3],
              o = t[0],
              c = t[1],
              u = t[2],
              _ = t[3];
            return (
              (e[0] = o * s + _ * n + c * i - u * a),
              (e[1] = c * s + _ * a + u * n - o * i),
              (e[2] = u * s + _ * i + o * a - c * n),
              (e[3] = _ * s - o * n - c * a - u * i),
              (o = t[4]),
              (c = t[5]),
              (u = t[6]),
              (_ = t[7]),
              (e[4] = o * s + _ * n + c * i - u * a),
              (e[5] = c * s + _ * a + u * n - o * i),
              (e[6] = u * s + _ * i + o * a - c * n),
              (e[7] = _ * s - o * n - c * a - u * i),
              e
            );
          }
          function Da(e, t, r) {
            var n = t[0],
              a = t[1],
              i = t[2],
              s = t[3],
              o = r[0],
              c = r[1],
              u = r[2],
              _ = r[3];
            return (
              (e[0] = n * _ + s * o + a * u - i * c),
              (e[1] = a * _ + s * c + i * o - n * u),
              (e[2] = i * _ + s * u + n * c - a * o),
              (e[3] = s * _ - n * o - a * c - i * u),
              (o = r[4]),
              (c = r[5]),
              (u = r[6]),
              (_ = r[7]),
              (e[4] = n * _ + s * o + a * u - i * c),
              (e[5] = a * _ + s * c + i * o - n * u),
              (e[6] = i * _ + s * u + n * c - a * o),
              (e[7] = s * _ - n * o - a * c - i * u),
              e
            );
          }
          function Ba(e, t, r, n) {
            if (Math.abs(n) < h) return Ea(e, t);
            var a = Math.hypot(r[0], r[1], r[2]);
            n *= 0.5;
            var i = Math.sin(n),
              s = (i * r[0]) / a,
              o = (i * r[1]) / a,
              c = (i * r[2]) / a,
              u = Math.cos(n),
              _ = t[0],
              l = t[1],
              f = t[2],
              d = t[3];
            (e[0] = _ * u + d * s + l * c - f * o),
              (e[1] = l * u + d * o + f * s - _ * c),
              (e[2] = f * u + d * c + _ * o - l * s),
              (e[3] = d * u - _ * s - l * o - f * c);
            var p = t[4],
              m = t[5],
              b = t[6],
              g = t[7];
            return (
              (e[4] = p * u + g * s + m * c - b * o),
              (e[5] = m * u + g * o + b * s - p * c),
              (e[6] = b * u + g * c + p * o - m * s),
              (e[7] = g * u - p * s - m * o - b * c),
              e
            );
          }
          function ja(e, t, r) {
            return (
              (e[0] = t[0] + r[0]),
              (e[1] = t[1] + r[1]),
              (e[2] = t[2] + r[2]),
              (e[3] = t[3] + r[3]),
              (e[4] = t[4] + r[4]),
              (e[5] = t[5] + r[5]),
              (e[6] = t[6] + r[6]),
              (e[7] = t[7] + r[7]),
              e
            );
          }
          function Ua(e, t, r) {
            var n = t[0],
              a = t[1],
              i = t[2],
              s = t[3],
              o = r[4],
              c = r[5],
              u = r[6],
              _ = r[7],
              l = t[4],
              f = t[5],
              h = t[6],
              d = t[7],
              p = r[0],
              m = r[1],
              b = r[2],
              g = r[3];
            return (
              (e[0] = n * g + s * p + a * b - i * m),
              (e[1] = a * g + s * m + i * p - n * b),
              (e[2] = i * g + s * b + n * m - a * p),
              (e[3] = s * g - n * p - a * m - i * b),
              (e[4] =
                n * _ + s * o + a * u - i * c + l * g + d * p + f * b - h * m),
              (e[5] =
                a * _ + s * c + i * o - n * u + f * g + d * m + h * p - l * b),
              (e[6] =
                i * _ + s * u + n * c - a * o + h * g + d * b + l * m - f * p),
              (e[7] =
                s * _ - n * o - a * c - i * u + d * g - l * p - f * m - h * b),
              e
            );
          }
          var Va = Ua;
          function Na(e, t, r) {
            return (
              (e[0] = t[0] * r),
              (e[1] = t[1] * r),
              (e[2] = t[2] * r),
              (e[3] = t[3] * r),
              (e[4] = t[4] * r),
              (e[5] = t[5] * r),
              (e[6] = t[6] * r),
              (e[7] = t[7] * r),
              e
            );
          }
          var Ga = aa;
          function qa(e, t, r, n) {
            var a = 1 - n;
            return (
              Ga(t, r) < 0 && (n = -n),
              (e[0] = t[0] * a + r[0] * n),
              (e[1] = t[1] * a + r[1] * n),
              (e[2] = t[2] * a + r[2] * n),
              (e[3] = t[3] * a + r[3] * n),
              (e[4] = t[4] * a + r[4] * n),
              (e[5] = t[5] * a + r[5] * n),
              (e[6] = t[6] * a + r[6] * n),
              (e[7] = t[7] * a + r[7] * n),
              e
            );
          }
          function Ha(e, t) {
            var r = Za(t);
            return (
              (e[0] = -t[0] / r),
              (e[1] = -t[1] / r),
              (e[2] = -t[2] / r),
              (e[3] = t[3] / r),
              (e[4] = -t[4] / r),
              (e[5] = -t[5] / r),
              (e[6] = -t[6] / r),
              (e[7] = t[7] / r),
              e
            );
          }
          function Wa(e, t) {
            return (
              (e[0] = -t[0]),
              (e[1] = -t[1]),
              (e[2] = -t[2]),
              (e[3] = t[3]),
              (e[4] = -t[4]),
              (e[5] = -t[5]),
              (e[6] = -t[6]),
              (e[7] = t[7]),
              e
            );
          }
          var Ya = sa,
            Xa = Ya,
            Za = ca,
            Ka = Za;
          function $a(e, t) {
            var r = Za(t);
            if (r > 0) {
              r = Math.sqrt(r);
              var n = t[0] / r,
                a = t[1] / r,
                i = t[2] / r,
                s = t[3] / r,
                o = t[4],
                c = t[5],
                u = t[6],
                _ = t[7],
                l = n * o + a * c + i * u + s * _;
              (e[0] = n),
                (e[1] = a),
                (e[2] = i),
                (e[3] = s),
                (e[4] = (o - n * l) / r),
                (e[5] = (c - a * l) / r),
                (e[6] = (u - i * l) / r),
                (e[7] = (_ - s * l) / r);
            }
            return e;
          }
          function Qa(e) {
            return (
              "quat2(" +
              e[0] +
              ", " +
              e[1] +
              ", " +
              e[2] +
              ", " +
              e[3] +
              ", " +
              e[4] +
              ", " +
              e[5] +
              ", " +
              e[6] +
              ", " +
              e[7] +
              ")"
            );
          }
          function Ja(e, t) {
            return (
              e[0] === t[0] &&
              e[1] === t[1] &&
              e[2] === t[2] &&
              e[3] === t[3] &&
              e[4] === t[4] &&
              e[5] === t[5] &&
              e[6] === t[6] &&
              e[7] === t[7]
            );
          }
          function ei(e, t) {
            var r = e[0],
              n = e[1],
              a = e[2],
              i = e[3],
              s = e[4],
              o = e[5],
              c = e[6],
              u = e[7],
              _ = t[0],
              l = t[1],
              f = t[2],
              d = t[3],
              p = t[4],
              m = t[5],
              b = t[6],
              g = t[7];
            return (
              Math.abs(r - _) <= h * Math.max(1, Math.abs(r), Math.abs(_)) &&
              Math.abs(n - l) <= h * Math.max(1, Math.abs(n), Math.abs(l)) &&
              Math.abs(a - f) <= h * Math.max(1, Math.abs(a), Math.abs(f)) &&
              Math.abs(i - d) <= h * Math.max(1, Math.abs(i), Math.abs(d)) &&
              Math.abs(s - p) <= h * Math.max(1, Math.abs(s), Math.abs(p)) &&
              Math.abs(o - m) <= h * Math.max(1, Math.abs(o), Math.abs(m)) &&
              Math.abs(c - b) <= h * Math.max(1, Math.abs(c), Math.abs(b)) &&
              Math.abs(u - g) <= h * Math.max(1, Math.abs(u), Math.abs(g))
            );
          }
          function ti() {
            var e = new d(2);
            return d != Float32Array && ((e[0] = 0), (e[1] = 0)), e;
          }
          function ri(e) {
            var t = new d(2);
            return (t[0] = e[0]), (t[1] = e[1]), t;
          }
          function ni(e, t) {
            var r = new d(2);
            return (r[0] = e), (r[1] = t), r;
          }
          function ai(e, t) {
            return (e[0] = t[0]), (e[1] = t[1]), e;
          }
          function ii(e, t, r) {
            return (e[0] = t), (e[1] = r), e;
          }
          function si(e, t, r) {
            return (e[0] = t[0] + r[0]), (e[1] = t[1] + r[1]), e;
          }
          function oi(e, t, r) {
            return (e[0] = t[0] - r[0]), (e[1] = t[1] - r[1]), e;
          }
          function ci(e, t, r) {
            return (e[0] = t[0] * r[0]), (e[1] = t[1] * r[1]), e;
          }
          function ui(e, t, r) {
            return (e[0] = t[0] / r[0]), (e[1] = t[1] / r[1]), e;
          }
          function _i(e, t) {
            return (e[0] = Math.ceil(t[0])), (e[1] = Math.ceil(t[1])), e;
          }
          function li(e, t) {
            return (e[0] = Math.floor(t[0])), (e[1] = Math.floor(t[1])), e;
          }
          function fi(e, t, r) {
            return (
              (e[0] = Math.min(t[0], r[0])), (e[1] = Math.min(t[1], r[1])), e
            );
          }
          function hi(e, t, r) {
            return (
              (e[0] = Math.max(t[0], r[0])), (e[1] = Math.max(t[1], r[1])), e
            );
          }
          function di(e, t) {
            return (e[0] = Math.round(t[0])), (e[1] = Math.round(t[1])), e;
          }
          function pi(e, t, r) {
            return (e[0] = t[0] * r), (e[1] = t[1] * r), e;
          }
          function mi(e, t, r, n) {
            return (e[0] = t[0] + r[0] * n), (e[1] = t[1] + r[1] * n), e;
          }
          function bi(e, t) {
            var r = t[0] - e[0],
              n = t[1] - e[1];
            return Math.hypot(r, n);
          }
          function gi(e, t) {
            var r = t[0] - e[0],
              n = t[1] - e[1];
            return r * r + n * n;
          }
          function yi(e) {
            var t = e[0],
              r = e[1];
            return Math.hypot(t, r);
          }
          function vi(e) {
            var t = e[0],
              r = e[1];
            return t * t + r * r;
          }
          function wi(e, t) {
            return (e[0] = -t[0]), (e[1] = -t[1]), e;
          }
          function Mi(e, t) {
            return (e[0] = 1 / t[0]), (e[1] = 1 / t[1]), e;
          }
          function xi(e, t) {
            var r = t[0],
              n = t[1],
              a = r * r + n * n;
            return (
              a > 0 && (a = 1 / Math.sqrt(a)),
              (e[0] = t[0] * a),
              (e[1] = t[1] * a),
              e
            );
          }
          function Ei(e, t) {
            return e[0] * t[0] + e[1] * t[1];
          }
          function ki(e, t, r) {
            var n = t[0] * r[1] - t[1] * r[0];
            return (e[0] = e[1] = 0), (e[2] = n), e;
          }
          function Ai(e, t, r, n) {
            var a = t[0],
              i = t[1];
            return (e[0] = a + n * (r[0] - a)), (e[1] = i + n * (r[1] - i)), e;
          }
          function Ti(e, t) {
            t = t || 1;
            var r = 2 * p() * Math.PI;
            return (e[0] = Math.cos(r) * t), (e[1] = Math.sin(r) * t), e;
          }
          function zi(e, t, r) {
            var n = t[0],
              a = t[1];
            return (
              (e[0] = r[0] * n + r[2] * a), (e[1] = r[1] * n + r[3] * a), e
            );
          }
          function Si(e, t, r) {
            var n = t[0],
              a = t[1];
            return (
              (e[0] = r[0] * n + r[2] * a + r[4]),
              (e[1] = r[1] * n + r[3] * a + r[5]),
              e
            );
          }
          function Fi(e, t, r) {
            var n = t[0],
              a = t[1];
            return (
              (e[0] = r[0] * n + r[3] * a + r[6]),
              (e[1] = r[1] * n + r[4] * a + r[7]),
              e
            );
          }
          function Li(e, t, r) {
            var n = t[0],
              a = t[1];
            return (
              (e[0] = r[0] * n + r[4] * a + r[12]),
              (e[1] = r[1] * n + r[5] * a + r[13]),
              e
            );
          }
          function Ci(e, t, r, n) {
            var a = t[0] - r[0],
              i = t[1] - r[1],
              s = Math.sin(n),
              o = Math.cos(n);
            return (
              (e[0] = a * o - i * s + r[0]), (e[1] = a * s + i * o + r[1]), e
            );
          }
          function Ri(e, t) {
            var r = e[0],
              n = e[1],
              a = t[0],
              i = t[1],
              s = r * r + n * n;
            s > 0 && (s = 1 / Math.sqrt(s));
            var o = a * a + i * i;
            o > 0 && (o = 1 / Math.sqrt(o));
            var c = (r * a + n * i) * s * o;
            return c > 1 ? 0 : c < -1 ? Math.PI : Math.acos(c);
          }
          function Oi(e) {
            return (e[0] = 0), (e[1] = 0), e;
          }
          function Pi(e) {
            return "vec2(" + e[0] + ", " + e[1] + ")";
          }
          function Ii(e, t) {
            return e[0] === t[0] && e[1] === t[1];
          }
          function Di(e, t) {
            var r = e[0],
              n = e[1],
              a = t[0],
              i = t[1];
            return (
              Math.abs(r - a) <= h * Math.max(1, Math.abs(r), Math.abs(a)) &&
              Math.abs(n - i) <= h * Math.max(1, Math.abs(n), Math.abs(i))
            );
          }
          var Bi = yi,
            ji = oi,
            Ui = ci,
            Vi = ui,
            Ni = bi,
            Gi = gi,
            qi = vi,
            Hi = (function () {
              var e = ti();
              return function (t, r, n, a, i, s) {
                var o, c;
                for (
                  r || (r = 2),
                    n || (n = 0),
                    c = a ? Math.min(a * r + n, t.length) : t.length,
                    o = n;
                  o < c;
                  o += r
                )
                  (e[0] = t[o]),
                    (e[1] = t[o + 1]),
                    i(e, e, s),
                    (t[o] = e[0]),
                    (t[o + 1] = e[1]);
                return t;
              };
            })();
        },
        2334: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
          const n = r(4017);
          AFRAME.registerSystem("zappar-camera", {
            init: function () {
              (this.camera = new n.Camera()), (this._callbacks = new Set());
            },
            emitCallbacks: function () {
              for (const e of this._callbacks) e();
            },
            registerForCallbacks: function (e) {
              this._callbacks.add(e);
            },
            unregisterForCallbacks: function (e) {
              this._callbacks.delete(e);
            },
          });
          const a = AFRAME.registerComponent("zappar-camera", {
            schema: {
              userFacing: { type: "boolean", default: !1 },
              userCameraMirrorMode: { type: "string", default: "poses" },
              rearCameraMirrorMode: { type: "string", default: "no-mirror" },
              poseMode: { type: "string", default: "default" },
              poseAnchorOrigin: { type: "selector" },
            },
            update: function (e) {
              const t = this.system.camera;
              switch (
                ((this.system.userFacing = this.data.userFacing),
                e.userFacing !== this.data.userFacing &&
                  this.system.permissionGranted &&
                  this.system.camera.start(this.data.userFacing),
                this.data.poseMode)
              ) {
                case "attitude":
                  t.poseMode = n.CameraPoseMode.Attitude;
                  break;
                case "anchor-origin":
                  t.poseMode = n.CameraPoseMode.AnchorOrigin;
                  break;
                default:
                  t.poseMode = n.CameraPoseMode.Default;
              }
              switch (this.data.userCameraMirrorMode) {
                case "poses":
                  t.userCameraMirrorMode = n.CameraMirrorMode.Poses;
                  break;
                case "css":
                  t.userCameraMirrorMode = n.CameraMirrorMode.CSS;
                  break;
                case "no-mirror":
                  t.userCameraMirrorMode = n.CameraMirrorMode.None;
                  break;
                default:
                  t.userCameraMirrorMode = n.CameraMirrorMode.Poses;
              }
              switch (this.data.rearCameraMirrorMode) {
                case "poses":
                  t.rearCameraMirrorMode = n.CameraMirrorMode.Poses;
                  break;
                case "css":
                  t.rearCameraMirrorMode = n.CameraMirrorMode.CSS;
                  break;
                case "no-mirror":
                default:
                  t.rearCameraMirrorMode = n.CameraMirrorMode.None;
              }
            },
            init: function () {
              const e = document.querySelector("a-scene");
              e.setAttribute("vr-mode-ui", "enabled: false");
              const t = e.object3D,
                r = e.renderer;
              n.glContextSet(r.getContext()),
                (t.background = this.system.camera.backgroundTexture);
            },
            tick: function () {
              const e = this.system.camera,
                t = document.querySelector("a-scene").renderer;
              if (
                this.data &&
                this.data.poseAnchorOrigin &&
                this.data.poseAnchorOrigin.components
              ) {
                const t = this.data.poseAnchorOrigin.components;
                t["zappar-face"]
                  ? (e.poseAnchorOrigin =
                      t["zappar-face"].trackerGroup.currentAnchor)
                  : t["zappar-image"]
                  ? (e.poseAnchorOrigin =
                      t["zappar-image"].trackerGroup.currentAnchor)
                  : t["zappar-instant"] &&
                    (e.poseAnchorOrigin =
                      t["zappar-instant"].trackerGroup.currentAnchor);
              }
              this.system.camera.updateFrame(t),
                (this.el.object3DMap.camera.matrixAutoUpdate = !1),
                (this.el.object3DMap.camera.projectionMatrix =
                  e.projectionMatrix),
                (this.el.object3DMap.camera.projectionMatrixInverse =
                  e.projectionMatrixInverse),
                (this.el.object3D.matrixAutoUpdate = !1),
                this.el.object3D.matrix.fromArray(e.rawPose),
                this.system.emitCallbacks();
            },
          });
          t.default = a;
        },
        5143: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
          const n = r(4017);
          t.default = AFRAME.registerComponent("zappar-compatibility-ui", {
            init: function () {
              this.el.setAttribute("visible", !1),
                n.browserIncompatible() &&
                  (this.el.children.length > 0
                    ? this.el.setAttribute("visible", !0)
                    : n.browserIncompatibleUI());
            },
            remove: function () {
              this.el.setAttribute("visible", !1);
            },
          });
        },
        2140: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
          const n = r(4017);
          t.default = AFRAME.registerComponent("zappar-face-landmark", {
            schema: {
              target: { type: "string", default: "nose-tip" },
              face: { type: "string" },
            },
            init: function () {
              const e = this.el,
                t = document.querySelector("a-scene").systems["zappar-camera"],
                r = t.camera,
                a = document.querySelector("a-scene").object3D,
                i = document.querySelector(this.data.face);
              if (
                !(
                  i &&
                  i.components &&
                  i.components["zappar-face"] &&
                  i.components["zappar-face"].trackerGroup
                )
              )
                throw new Error("Face tracker could not be found.");
              (this.trackerGroup = new n.FaceLandmarkGroup(
                r,
                i.components["zappar-face"].trackerGroup.faceTracker,
                n.FaceLandmarkName[
                  this.data.target.toUpperCase().replace("-", "_")
                ]
              )),
                a.add(this.trackerGroup),
                (e.object3D.matrixAutoUpdate = !1),
                t.registerForCallbacks(
                  (this._frameUpdate = () => {
                    e.object3D.matrix = this.trackerGroup.matrix;
                  })
                );
            },
            remove: function () {
              document
                .querySelector("a-scene")
                .systems["zappar-camera"].unregisterForCallbacks(
                  this._frameUpdate
                ),
                this.trackerGroup.landmark.destroy();
            },
          });
        },
        9728: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
          const n = r(4017);
          t.default = AFRAME.registerGeometry("face-mesh", {
            schema: {
              face: { type: "string" },
              model: { type: "string" },
              fillMouth: { type: "boolean" },
              fillEyeLeft: { type: "boolean" },
              fillEyeRight: { type: "boolean" },
              fillNeck: { type: "boolean" },
            },
            init: function (e) {
              e.buffer = !1;
              const t = {
                  fillMouth: e.fillMouth || !1,
                  fillEyeLeft: e.fillEyeLeft || !1,
                  fillEyeRight: e.fillEyeRight || !1,
                  fillNeck: e.fillNeck || !1,
                },
                r =
                  "full-head-simplified" === e.model
                    ? new n.FaceMeshLoader().loadFullHeadSimplified(t)
                    : new n.FaceMeshLoader().loadFace(t),
                a = new n.FaceBufferGeometry(r);
              (this.geometry = a),
                document
                  .querySelector("a-scene")
                  .systems["zappar-camera"].registerForCallbacks(
                    (this._frameUpdate = () => {
                      const t = document.querySelector(e.face);
                      t &&
                        t.components &&
                        t.components["zappar-face"] &&
                        t.components["zappar-face"].trackerGroup &&
                        a.updateFromFaceAnchorGroup(
                          t.components["zappar-face"].trackerGroup
                        );
                    })
                  );
            },
          });
        },
        6381: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
          const n = r(4017);
          t.default = AFRAME.registerComponent("zappar-face", {
            schema: { enabled: { type: "boolean", default: !0 } },
            update: function (e) {
              this.data.enabled !== e.enabled &&
                (this.trackerGroup.faceTracker.enabled = this.data.enabled);
            },
            init: function () {
              const e = this.el,
                t = document.querySelector("a-scene").systems["zappar-camera"],
                r = t.camera,
                a = document.querySelector("a-scene").object3D;
              (this.trackerGroup = new n.FaceAnchorGroup(
                r,
                new n.FaceTrackerLoader().load()
              )),
                a.add(this.trackerGroup),
                this.trackerGroup.faceTracker.onVisible.bind((t) =>
                  e.emit("zappar-visible", t)
                ),
                this.trackerGroup.faceTracker.onNotVisible.bind((t) =>
                  e.emit("zappar-notvisible", t)
                ),
                this.trackerGroup.faceTracker.onNewAnchor.bind((t) =>
                  e.emit("zappar-newanchor", t)
                ),
                (e.object3D.matrixAutoUpdate = !1),
                t.registerForCallbacks(
                  (this._frameUpdate = () => {
                    e.object3D.matrix = this.trackerGroup.matrix;
                  })
                );
            },
            remove: function () {
              document
                .querySelector("a-scene")
                .systems["zappar-camera"].unregisterForCallbacks(
                  this._frameUpdate
                ),
                this.trackerGroup.faceTracker.destroy();
            },
          });
        },
        7613: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
          const n = r(4017);
          t.default = AFRAME.registerComponent("zappar-head-mask", {
            schema: { face: { type: "string" } },
            init: function () {
              const e = this.el,
                t = new n.HeadMaskMeshLoader().load();
              (this.mesh = t),
                (this.mesh.material.colorWrite = !1),
                e.setObject3D("mesh", this.mesh),
                document
                  .querySelector("a-scene")
                  .systems["zappar-camera"].registerForCallbacks(
                    (this._frameUpdate = () => {
                      if (!this.data) return;
                      const e = document.querySelector(this.data.face);
                      e &&
                        e.components &&
                        e.components["zappar-face"] &&
                        e.components["zappar-face"].trackerGroup &&
                        t.updateFromFaceAnchorGroup(
                          e.components["zappar-face"].trackerGroup
                        );
                    })
                  );
            },
            remove: function () {
              document
                .querySelector("a-scene")
                .systems["zappar-camera"].unregisterForCallbacks(
                  this._frameUpdate
                ),
                this.el.removeObject3D("mesh");
            },
          });
        },
        9978: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
          const n = r(4017);
          t.default = AFRAME.registerComponent("zappar-image", {
            schema: {
              target: { type: "asset", default: "" },
              enabled: { type: "boolean", default: !0 },
            },
            update: function (e) {
              this.data.target !== e.target &&
                this.trackerGroup.imageTracker.loadTarget(this.data.target),
                this.data.enabled !== e.enabled &&
                  (this.trackerGroup.imageTracker.enabled = this.data.enabled);
            },
            init: function () {
              const e = this.el,
                t = document.querySelector("a-scene").systems["zappar-camera"],
                r = t.camera,
                a = document.querySelector("a-scene").object3D;
              (this.trackerGroup = new n.ImageAnchorGroup(
                r,
                new n.ImageTracker()
              )),
                a.add(this.trackerGroup),
                (e.object3D.matrixAutoUpdate = !1),
                t.registerForCallbacks(
                  (this._frameUpdate = () => {
                    e.object3D.matrix = this.trackerGroup.matrix;
                  })
                ),
                this.trackerGroup.imageTracker.onVisible.bind((t) =>
                  e.emit("zappar-visible", t)
                ),
                this.trackerGroup.imageTracker.onNotVisible.bind((t) =>
                  e.emit("zappar-notvisible", t)
                ),
                this.trackerGroup.imageTracker.onNewAnchor.bind((t) =>
                  e.emit("zappar-newanchor", t)
                );
            },
            remove: function () {
              document
                .querySelector("a-scene")
                .systems["zappar-camera"].unregisterForCallbacks(
                  this._frameUpdate
                ),
                this.trackerGroup.imageTracker.destroy();
            },
          });
        },
        5524: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
          const n = r(4017);
          t.default = AFRAME.registerComponent("zappar-instant", {
            schema: {
              placementMode: { type: "boolean", default: !1 },
              enabled: { type: "boolean", default: !0 },
            },
            update: function (e) {
              this.data.enabled !== e.enabled &&
                (this.trackerGroup.instantTracker.enabled = this.data.enabled);
            },
            init: function () {
              const e = this.el,
                t = document.querySelector("a-scene").systems["zappar-camera"],
                r = t.camera,
                a = document.querySelector("a-scene").object3D,
                i = new n.InstantWorldTracker();
              (this.trackerGroup = new n.InstantWorldAnchorGroup(r, i)),
                a.add(this.trackerGroup),
                (e.object3D.matrixAutoUpdate = !1),
                t.registerForCallbacks(
                  (this._frameUpdate = () => {
                    this.data.placementMode &&
                      i.setAnchorPoseFromCameraOffset(0, 0, -5),
                      (e.object3D.matrix = this.trackerGroup.matrix);
                  })
                );
            },
            remove: function () {
              document
                .querySelector("a-scene")
                .systems["zappar-camera"].unregisterForCallbacks(
                  this._frameUpdate
                ),
                this.trackerGroup.instantTracker.destroy();
            },
          });
        },
        1207: (e, t, r) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 });
          const n = r(4017);
          t.default = AFRAME.registerComponent("zappar-permissions-ui", {
            init: function () {
              this.el.setAttribute("visible", !1),
                n.permissionRequestUI().then((e) => {
                  const t =
                    document.querySelector("a-scene").systems["zappar-camera"];
                  (t.permissionGranted = e),
                    e
                      ? t.camera.start(t.userFacing)
                      : this.el.children.length > 0
                      ? this.el.setAttribute("visible", !0)
                      : n.permissionDeniedUI();
                });
            },
            remove: function () {
              this.el.setAttribute("visible", !1);
            },
          });
        },
        3830: (e, t) => {
          "use strict";
          Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.VERSION = void 0),
            (t.VERSION = "0.3.9");
        },
        2238: function (e, t, r) {
          var n;
          !(function (a, i) {
            "use strict";
            var s = "function",
              o = "object",
              c = "model",
              u = "name",
              _ = "type",
              l = "vendor",
              f = "version",
              h = "architecture",
              d = "console",
              p = "mobile",
              m = "tablet",
              b = "smarttv",
              g = "wearable",
              y = {
                extend: function (e, t) {
                  var r = {};
                  for (var n in e)
                    t[n] && t[n].length % 2 == 0
                      ? (r[n] = t[n].concat(e[n]))
                      : (r[n] = e[n]);
                  return r;
                },
                has: function (e, t) {
                  return (
                    "string" == typeof e &&
                    -1 !== t.toLowerCase().indexOf(e.toLowerCase())
                  );
                },
                lowerize: function (e) {
                  return e.toLowerCase();
                },
                major: function (e) {
                  return "string" == typeof e
                    ? e.replace(/[^\d\.]/g, "").split(".")[0]
                    : i;
                },
                trim: function (e) {
                  return e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
                },
              },
              v = {
                rgx: function (e, t) {
                  for (var r, n, a, c, u, _, l = 0; l < t.length && !u; ) {
                    var f = t[l],
                      h = t[l + 1];
                    for (r = n = 0; r < f.length && !u; )
                      if ((u = f[r++].exec(e)))
                        for (a = 0; a < h.length; a++)
                          (_ = u[++n]),
                            typeof (c = h[a]) === o && c.length > 0
                              ? 2 == c.length
                                ? typeof c[1] == s
                                  ? (this[c[0]] = c[1].call(this, _))
                                  : (this[c[0]] = c[1])
                                : 3 == c.length
                                ? typeof c[1] !== s || (c[1].exec && c[1].test)
                                  ? (this[c[0]] = _ ? _.replace(c[1], c[2]) : i)
                                  : (this[c[0]] = _
                                      ? c[1].call(this, _, c[2])
                                      : i)
                                : 4 == c.length &&
                                  (this[c[0]] = _
                                    ? c[3].call(this, _.replace(c[1], c[2]))
                                    : i)
                              : (this[c] = _ || i);
                    l += 2;
                  }
                },
                str: function (e, t) {
                  for (var r in t)
                    if (typeof t[r] === o && t[r].length > 0) {
                      for (var n = 0; n < t[r].length; n++)
                        if (y.has(t[r][n], e)) return "?" === r ? i : r;
                    } else if (y.has(t[r], e)) return "?" === r ? i : r;
                  return e;
                },
              },
              w = {
                browser: {
                  oldsafari: {
                    version: {
                      "1.0": "/8",
                      1.2: "/1",
                      1.3: "/3",
                      "2.0": "/412",
                      "2.0.2": "/416",
                      "2.0.3": "/417",
                      "2.0.4": "/419",
                      "?": "/",
                    },
                  },
                },
                device: {
                  amazon: { model: { "Fire Phone": ["SD", "KF"] } },
                  sprint: {
                    model: { "Evo Shift 4G": "7373KT" },
                    vendor: { HTC: "APA", Sprint: "Sprint" },
                  },
                },
                os: {
                  windows: {
                    version: {
                      ME: "4.90",
                      "NT 3.11": "NT3.51",
                      "NT 4.0": "NT4.0",
                      2e3: "NT 5.0",
                      XP: ["NT 5.1", "NT 5.2"],
                      Vista: "NT 6.0",
                      7: "NT 6.1",
                      8: "NT 6.2",
                      8.1: "NT 6.3",
                      10: ["NT 6.4", "NT 10.0"],
                      RT: "ARM",
                    },
                  },
                },
              },
              M = {
                browser: [
                  [
                    /(opera\smini)\/([\w\.-]+)/i,
                    /(opera\s[mobiletab]{3,6}).+version\/([\w\.-]+)/i,
                    /(opera).+version\/([\w\.]+)/i,
                    /(opera)[\/\s]+([\w\.]+)/i,
                  ],
                  [u, f],
                  [/(opios)[\/\s]+([\w\.]+)/i],
                  [[u, "Opera Mini"], f],
                  [/\s(opr)\/([\w\.]+)/i],
                  [[u, "Opera"], f],
                  [
                    /(kindle)\/([\w\.]+)/i,
                    /(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]*)/i,
                    /(avant\s|iemobile|slim)(?:browser)?[\/\s]?([\w\.]*)/i,
                    /(bidubrowser|baidubrowser)[\/\s]?([\w\.]+)/i,
                    /(?:ms|\()(ie)\s([\w\.]+)/i,
                    /(rekonq)\/([\w\.]*)/i,
                    /(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon)\/([\w\.-]+)/i,
                  ],
                  [u, f],
                  [/(konqueror)\/([\w\.]+)/i],
                  [[u, "Konqueror"], f],
                  [/(trident).+rv[:\s]([\w\.]{1,9}).+like\sgecko/i],
                  [[u, "IE"], f],
                  [/(edge|edgios|edga|edg)\/((\d+)?[\w\.]+)/i],
                  [[u, "Edge"], f],
                  [/(yabrowser)\/([\w\.]+)/i],
                  [[u, "Yandex"], f],
                  [/(Avast)\/([\w\.]+)/i],
                  [[u, "Avast Secure Browser"], f],
                  [/(AVG)\/([\w\.]+)/i],
                  [[u, "AVG Secure Browser"], f],
                  [/(puffin)\/([\w\.]+)/i],
                  [[u, "Puffin"], f],
                  [/(focus)\/([\w\.]+)/i],
                  [[u, "Firefox Focus"], f],
                  [/(opt)\/([\w\.]+)/i],
                  [[u, "Opera Touch"], f],
                  [/((?:[\s\/])uc?\s?browser|(?:juc.+)ucweb)[\/\s]?([\w\.]+)/i],
                  [[u, "UCBrowser"], f],
                  [/(comodo_dragon)\/([\w\.]+)/i],
                  [[u, /_/g, " "], f],
                  [/(windowswechat qbcore)\/([\w\.]+)/i],
                  [[u, "WeChat(Win) Desktop"], f],
                  [/(micromessenger)\/([\w\.]+)/i],
                  [[u, "WeChat"], f],
                  [/(brave)\/([\w\.]+)/i],
                  [[u, "Brave"], f],
                  [/(whale)\/([\w\.]+)/i],
                  [[u, "Whale"], f],
                  [/(qqbrowserlite)\/([\w\.]+)/i],
                  [u, f],
                  [/(QQ)\/([\d\.]+)/i],
                  [u, f],
                  [/m?(qqbrowser)[\/\s]?([\w\.]+)/i],
                  [u, f],
                  [/(baiduboxapp)[\/\s]?([\w\.]+)/i],
                  [u, f],
                  [/(2345Explorer)[\/\s]?([\w\.]+)/i],
                  [u, f],
                  [/(MetaSr)[\/\s]?([\w\.]+)/i],
                  [u],
                  [/(LBBROWSER)/i],
                  [u],
                  [/xiaomi\/miuibrowser\/([\w\.]+)/i],
                  [f, [u, "MIUI Browser"]],
                  [/;fbav\/([\w\.]+);/i],
                  [f, [u, "Facebook"]],
                  [/FBAN\/FBIOS|FB_IAB\/FB4A/i],
                  [[u, "Facebook"]],
                  [
                    /safari\s(line)\/([\w\.]+)/i,
                    /android.+(line)\/([\w\.]+)\/iab/i,
                  ],
                  [u, f],
                  [/headlesschrome(?:\/([\w\.]+)|\s)/i],
                  [f, [u, "Chrome Headless"]],
                  [/\swv\).+(chrome)\/([\w\.]+)/i],
                  [[u, /(.+)/, "$1 WebView"], f],
                  [/((?:oculus|samsung)browser)\/([\w\.]+)/i],
                  [[u, /(.+(?:g|us))(.+)/, "$1 $2"], f],
                  [
                    /android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)*/i,
                  ],
                  [f, [u, "Android Browser"]],
                  [/(coc_coc_browser)\/([\w\.]+)/i],
                  [[u, "Coc Coc"], f],
                  [/(sailfishbrowser)\/([\w\.]+)/i],
                  [[u, "Sailfish Browser"], f],
                  [
                    /(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i,
                  ],
                  [u, f],
                  [/(dolfin)\/([\w\.]+)/i],
                  [[u, "Dolphin"], f],
                  [/(qihu|qhbrowser|qihoobrowser|360browser)/i],
                  [[u, "360 Browser"]],
                  [/((?:android.+)crmo|crios)\/([\w\.]+)/i],
                  [[u, "Chrome"], f],
                  [/(coast)\/([\w\.]+)/i],
                  [[u, "Opera Coast"], f],
                  [/fxios\/([\w\.-]+)/i],
                  [f, [u, "Firefox"]],
                  [/version\/([\w\.]+)\s.*mobile\/\w+\s(safari)/i],
                  [f, [u, "Mobile Safari"]],
                  [/version\/([\w\.]+)\s.*(mobile\s?safari|safari)/i],
                  [f, u],
                  [
                    /webkit.+?(gsa)\/([\w\.]+)\s.*(mobile\s?safari|safari)(\/[\w\.]+)/i,
                  ],
                  [[u, "GSA"], f],
                  [/webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i],
                  [u, [f, v.str, w.browser.oldsafari.version]],
                  [/(webkit|khtml)\/([\w\.]+)/i],
                  [u, f],
                  [/(navigator|netscape)\/([\w\.-]+)/i],
                  [[u, "Netscape"], f],
                  [
                    /(swiftfox)/i,
                    /(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i,
                    /(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([\w\.-]+)$/i,
                    /(firefox)\/([\w\.]+)\s[\w\s\-]+\/[\w\.]+$/i,
                    /(mozilla)\/([\w\.]+)\s.+rv\:.+gecko\/\d+/i,
                    /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir)[\/\s]?([\w\.]+)/i,
                    /(links)\s\(([\w\.]+)/i,
                    /(gobrowser)\/?([\w\.]*)/i,
                    /(ice\s?browser)\/v?([\w\._]+)/i,
                    /(mosaic)[\/\s]([\w\.]+)/i,
                  ],
                  [u, f],
                ],
                cpu: [
                  [/(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;\)]/i],
                  [[h, "amd64"]],
                  [/(ia32(?=;))/i],
                  [[h, y.lowerize]],
                  [/((?:i[346]|x)86)[;\)]/i],
                  [[h, "ia32"]],
                  [/windows\s(ce|mobile);\sppc;/i],
                  [[h, "arm"]],
                  [/((?:ppc|powerpc)(?:64)?)(?:\smac|;|\))/i],
                  [[h, /ower/, "", y.lowerize]],
                  [/(sun4\w)[;\)]/i],
                  [[h, "sparc"]],
                  [
                    /((?:avr32|ia64(?=;))|68k(?=\))|arm(?:64|(?=v\d+[;l]))|(?=atmel\s)avr|(?:irix|mips|sparc)(?:64)?(?=;)|pa-risc)/i,
                  ],
                  [[h, y.lowerize]],
                ],
                device: [
                  [/\((ipad|playbook);[\w\s\),;-]+(rim|apple)/i],
                  [c, l, [_, m]],
                  [/applecoremedia\/[\w\.]+ \((ipad)/],
                  [c, [l, "Apple"], [_, m]],
                  [/(apple\s{0,1}tv)/i],
                  [
                    [c, "Apple TV"],
                    [l, "Apple"],
                    [_, b],
                  ],
                  [
                    /(archos)\s(gamepad2?)/i,
                    /(hp).+(touchpad)/i,
                    /(hp).+(tablet)/i,
                    /(kindle)\/([\w\.]+)/i,
                    /\s(nook)[\w\s]+build\/(\w+)/i,
                    /(dell)\s(strea[kpr\s\d]*[\dko])/i,
                  ],
                  [l, c, [_, m]],
                  [/(kf[A-z]+)(\sbuild\/|\)).+silk\//i],
                  [c, [l, "Amazon"], [_, m]],
                  [/(sd|kf)[0349hijorstuw]+(\sbuild\/|\)).+silk\//i],
                  [
                    [c, v.str, w.device.amazon.model],
                    [l, "Amazon"],
                    [_, p],
                  ],
                  [/android.+aft([\w])(\sbuild\/|\))/i],
                  [c, [l, "Amazon"], [_, b]],
                  [/\((ip[honed|\s\w*]+);.+(apple)/i],
                  [c, l, [_, p]],
                  [/\((ip[honed|\s\w*]+);/i],
                  [c, [l, "Apple"], [_, p]],
                  [
                    /(blackberry)[\s-]?(\w+)/i,
                    /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[\s_-]?([\w-]*)/i,
                    /(hp)\s([\w\s]+\w)/i,
                    /(asus)-?(\w+)/i,
                  ],
                  [l, c, [_, p]],
                  [/\(bb10;\s(\w+)/i],
                  [c, [l, "BlackBerry"], [_, p]],
                  [
                    /android.+(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7|padfone|p00c)/i,
                  ],
                  [c, [l, "Asus"], [_, m]],
                  [
                    /(sony)\s(tablet\s[ps])\sbuild\//i,
                    /(sony)?(?:sgp.+)\sbuild\//i,
                  ],
                  [
                    [l, "Sony"],
                    [c, "Xperia Tablet"],
                    [_, m],
                  ],
                  [
                    /android.+\s([c-g]\d{4}|so[-l]\w+)(?=\sbuild\/|\).+chrome\/(?![1-6]{0,1}\d\.))/i,
                  ],
                  [c, [l, "Sony"], [_, p]],
                  [/\s(ouya)\s/i, /(nintendo)\s([wids3u]+)/i],
                  [l, c, [_, d]],
                  [/android.+;\s(shield)\sbuild/i],
                  [c, [l, "Nvidia"], [_, d]],
                  [/(playstation\s[34portablevi]+)/i],
                  [c, [l, "Sony"], [_, d]],
                  [/(sprint\s(\w+))/i],
                  [
                    [l, v.str, w.device.sprint.vendor],
                    [c, v.str, w.device.sprint.model],
                    [_, p],
                  ],
                  [
                    /(htc)[;_\s-]{1,2}([\w\s]+(?=\)|\sbuild)|\w+)/i,
                    /(zte)-(\w*)/i,
                    /(alcatel|geeksphone|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]*)/i,
                  ],
                  [l, [c, /_/g, " "], [_, p]],
                  [/(nexus\s9)/i],
                  [c, [l, "HTC"], [_, m]],
                  [
                    /d\/huawei([\w\s-]+)[;\)]/i,
                    /android.+\s(nexus\s6p|vog-[at]?l\d\d|ane-[at]?l[x\d]\d|eml-a?l\d\da?|lya-[at]?l\d[\dc]|clt-a?l\d\di?)/i,
                  ],
                  [c, [l, "Huawei"], [_, p]],
                  [/android.+(bah2?-a?[lw]\d{2})/i],
                  [c, [l, "Huawei"], [_, m]],
                  [/(microsoft);\s(lumia[\s\w]+)/i],
                  [l, c, [_, p]],
                  [/[\s\(;](xbox(?:\sone)?)[\s\);]/i],
                  [c, [l, "Microsoft"], [_, d]],
                  [/(kin\.[onetw]{3})/i],
                  [
                    [c, /\./g, " "],
                    [l, "Microsoft"],
                    [_, p],
                  ],
                  [
                    /\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?:?(\s4g)?)[\w\s]+build\//i,
                    /mot[\s-]?(\w*)/i,
                    /(XT\d{3,4}) build\//i,
                    /(nexus\s6)/i,
                  ],
                  [c, [l, "Motorola"], [_, p]],
                  [/android.+\s(mz60\d|xoom[\s2]{0,2})\sbuild\//i],
                  [c, [l, "Motorola"], [_, m]],
                  [/hbbtv\/\d+\.\d+\.\d+\s+\([\w\s]*;\s*(\w[^;]*);([^;]*)/i],
                  [
                    [l, y.trim],
                    [c, y.trim],
                    [_, b],
                  ],
                  [/hbbtv.+maple;(\d+)/i],
                  [
                    [c, /^/, "SmartTV"],
                    [l, "Samsung"],
                    [_, b],
                  ],
                  [/\(dtv[\);].+(aquos)/i],
                  [c, [l, "Sharp"], [_, b]],
                  [
                    /android.+((sch-i[89]0\d|shw-m380s|SM-P605|SM-P610|SM-P587|gt-p\d{4}|gt-n\d+|sgh-t8[56]9|nexus 10))/i,
                    /((SM-T\w+))/i,
                  ],
                  [[l, "Samsung"], c, [_, m]],
                  [/smart-tv.+(samsung)/i],
                  [l, [_, b], c],
                  [
                    /((s[cgp]h-\w+|gt-\w+|galaxy\snexus|sm-\w[\w\d]+))/i,
                    /(sam[sung]*)[\s-]*(\w+-?[\w-]*)/i,
                    /sec-((sgh\w+))/i,
                  ],
                  [[l, "Samsung"], c, [_, p]],
                  [/sie-(\w*)/i],
                  [c, [l, "Siemens"], [_, p]],
                  [
                    /(maemo|nokia).*(n900|lumia\s\d+)/i,
                    /(nokia)[\s_-]?([\w-]*)/i,
                  ],
                  [[l, "Nokia"], c, [_, p]],
                  [/android[x\d\.\s;]+\s([ab][1-7]\-?[0178a]\d\d?)/i],
                  [c, [l, "Acer"], [_, m]],
                  [/android.+([vl]k\-?\d{3})\s+build/i],
                  [c, [l, "LG"], [_, m]],
                  [/android\s3\.[\s\w;-]{10}(lg?)-([06cv9]{3,4})/i],
                  [[l, "LG"], c, [_, m]],
                  [/linux;\snetcast.+smarttv/i, /lg\snetcast\.tv-201\d/i],
                  [[l, "LG"], c, [_, b]],
                  [
                    /(nexus\s[45])/i,
                    /lg[e;\s\/-]+(\w*)/i,
                    /android.+lg(\-?[\d\w]+)\s+build/i,
                  ],
                  [c, [l, "LG"], [_, p]],
                  [/(lenovo)\s?(s(?:5000|6000)(?:[\w-]+)|tab(?:[\s\w]+))/i],
                  [l, c, [_, m]],
                  [/android.+(ideatab[a-z0-9\-\s]+)/i],
                  [c, [l, "Lenovo"], [_, m]],
                  [/(lenovo)[_\s-]?([\w-]+)/i],
                  [l, c, [_, p]],
                  [/linux;.+((jolla));/i],
                  [l, c, [_, p]],
                  [/((pebble))app\/[\d\.]+\s/i],
                  [l, c, [_, g]],
                  [/android.+;\s(oppo)\s?([\w\s]+)\sbuild/i],
                  [l, c, [_, p]],
                  [/crkey/i],
                  [
                    [c, "Chromecast"],
                    [l, "Google"],
                    [_, b],
                  ],
                  [/android.+;\s(glass)\s\d/i],
                  [c, [l, "Google"], [_, g]],
                  [/android.+;\s(pixel c)[\s)]/i],
                  [c, [l, "Google"], [_, m]],
                  [/android.+;\s(pixel( [2-9]a?)?( xl)?)[\s)]/i],
                  [c, [l, "Google"], [_, p]],
                  [
                    /android.+;\s(\w+)\s+build\/hm\1/i,
                    /android.+(hm[\s\-_]?note?[\s_]?(?:\d\w)?)\sbuild/i,
                    /android.+(redmi[\s\-_]?(?:note|k)?(?:[\s_]?[\w\s]+))(?:\sbuild|\))/i,
                    /android.+(mi[\s\-_]?(?:a\d|one|one[\s_]plus|note lte)?[\s_]?(?:\d?\w?)[\s_]?(?:plus)?)\sbuild/i,
                  ],
                  [
                    [c, /_/g, " "],
                    [l, "Xiaomi"],
                    [_, p],
                  ],
                  [
                    /android.+(mi[\s\-_]?(?:pad)(?:[\s_]?[\w\s]+))(?:\sbuild|\))/i,
                  ],
                  [
                    [c, /_/g, " "],
                    [l, "Xiaomi"],
                    [_, m],
                  ],
                  [/android.+;\s(m[1-5]\snote)\sbuild/i],
                  [c, [l, "Meizu"], [_, p]],
                  [/(mz)-([\w-]{2,})/i],
                  [[l, "Meizu"], c, [_, p]],
                  [
                    /android.+a000(1)\s+build/i,
                    /android.+oneplus\s(a\d{4})[\s)]/i,
                  ],
                  [c, [l, "OnePlus"], [_, p]],
                  [/android.+[;\/]\s*(RCT[\d\w]+)\s+build/i],
                  [c, [l, "RCA"], [_, m]],
                  [/android.+[;\/\s](Venue[\d\s]{2,7})\s+build/i],
                  [c, [l, "Dell"], [_, m]],
                  [/android.+[;\/]\s*(Q[T|M][\d\w]+)\s+build/i],
                  [c, [l, "Verizon"], [_, m]],
                  [
                    /android.+[;\/]\s+(Barnes[&\s]+Noble\s+|BN[RT])(\S(?:.*\S)?)\s+build/i,
                  ],
                  [[l, "Barnes & Noble"], c, [_, m]],
                  [/android.+[;\/]\s+(TM\d{3}.*\b)\s+build/i],
                  [c, [l, "NuVision"], [_, m]],
                  [/android.+;\s(k88)\sbuild/i],
                  [c, [l, "ZTE"], [_, m]],
                  [/android.+[;\/]\s*(gen\d{3})\s+build.*49h/i],
                  [c, [l, "Swiss"], [_, p]],
                  [/android.+[;\/]\s*(zur\d{3})\s+build/i],
                  [c, [l, "Swiss"], [_, m]],
                  [/android.+[;\/]\s*((Zeki)?TB.*\b)\s+build/i],
                  [c, [l, "Zeki"], [_, m]],
                  [
                    /(android).+[;\/]\s+([YR]\d{2})\s+build/i,
                    /android.+[;\/]\s+(Dragon[\-\s]+Touch\s+|DT)(\w{5})\sbuild/i,
                  ],
                  [[l, "Dragon Touch"], c, [_, m]],
                  [/android.+[;\/]\s*(NS-?\w{0,9})\sbuild/i],
                  [c, [l, "Insignia"], [_, m]],
                  [/android.+[;\/]\s*((NX|Next)-?\w{0,9})\s+build/i],
                  [c, [l, "NextBook"], [_, m]],
                  [
                    /android.+[;\/]\s*(Xtreme\_)?(V(1[045]|2[015]|30|40|60|7[05]|90))\s+build/i,
                  ],
                  [[l, "Voice"], c, [_, p]],
                  [/android.+[;\/]\s*(LVTEL\-)?(V1[12])\s+build/i],
                  [[l, "LvTel"], c, [_, p]],
                  [/android.+;\s(PH-1)\s/i],
                  [c, [l, "Essential"], [_, p]],
                  [/android.+[;\/]\s*(V(100MD|700NA|7011|917G).*\b)\s+build/i],
                  [c, [l, "Envizen"], [_, m]],
                  [/android.+[;\/]\s*(Le[\s\-]+Pan)[\s\-]+(\w{1,9})\s+build/i],
                  [l, c, [_, m]],
                  [/android.+[;\/]\s*(Trio[\s\w\-\.]+)\s+build/i],
                  [c, [l, "MachSpeed"], [_, m]],
                  [/android.+[;\/]\s*(Trinity)[\-\s]*(T\d{3})\s+build/i],
                  [l, c, [_, m]],
                  [/android.+[;\/]\s*TU_(1491)\s+build/i],
                  [c, [l, "Rotor"], [_, m]],
                  [/android.+(Gigaset)[\s\-]+(Q\w{1,9})\s+build/i],
                  [l, c, [_, m]],
                  [
                    /android .+?; ([^;]+?)(?: build|\) applewebkit).+? mobile safari/i,
                  ],
                  [c, [_, p]],
                  [
                    /android .+?;\s([^;]+?)(?: build|\) applewebkit).+?(?! mobile) safari/i,
                  ],
                  [c, [_, m]],
                  [/\s(tablet|tab)[;\/]/i, /\s(mobile)(?:[;\/]|\ssafari)/i],
                  [[_, y.lowerize], l, c],
                  [/[\s\/\(](smart-?tv)[;\)]/i],
                  [[_, b]],
                  [/(android[\w\.\s\-]{0,9});.+build/i],
                  [c, [l, "Generic"]],
                  [/(phone)/i],
                  [[_, p]],
                ],
                engine: [
                  [/windows.+\sedge\/([\w\.]+)/i],
                  [f, [u, "EdgeHTML"]],
                  [/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i],
                  [f, [u, "Blink"]],
                  [
                    /(presto)\/([\w\.]+)/i,
                    /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i,
                    /(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i,
                    /(icab)[\/\s]([23]\.[\d\.]+)/i,
                  ],
                  [u, f],
                  [/rv\:([\w\.]{1,9}).+(gecko)/i],
                  [f, u],
                ],
                os: [
                  [
                    /(xbox);\s+xbox\s([^\);]+)/i,
                    /microsoft\s(windows)\s(vista|xp)/i,
                  ],
                  [u, f],
                  [
                    /(windows)\snt\s6\.2;\s(arm)/i,
                    /(windows\sphone(?:\sos)*)[\s\/]?([\d\.\s\w]*)/i,
                    /(windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i,
                  ],
                  [u, [f, v.str, w.os.windows.version]],
                  [/(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i],
                  [
                    [u, "Windows"],
                    [f, v.str, w.os.windows.version],
                  ],
                  [/\((bb)(10);/i],
                  [[u, "BlackBerry"], f],
                  [
                    /(blackberry)\w*\/?([\w\.]*)/i,
                    /(tizen|kaios)[\/\s]([\w\.]+)/i,
                    /(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|sailfish|contiki)[\/\s-]?([\w\.]*)/i,
                  ],
                  [u, f],
                  [/(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]*)/i],
                  [[u, "Symbian"], f],
                  [/\((series40);/i],
                  [u],
                  [/mozilla.+\(mobile;.+gecko.+firefox/i],
                  [[u, "Firefox OS"], f],
                  [/crkey\/([\d\.]+)/i],
                  [f, [u, "Chromecast"]],
                  [
                    /(nintendo|playstation)\s([wids34portablevu]+)/i,
                    /(mint)[\/\s\(]?(\w*)/i,
                    /(mageia|vectorlinux)[;\s]/i,
                    /(joli|[kxln]?ubuntu|debian|suse|opensuse|gentoo|(?=\s)arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?(?!chrom)([\w\.-]*)/i,
                    /(hurd|linux)\s?([\w\.]*)/i,
                    /(gnu)\s?([\w\.]*)/i,
                  ],
                  [u, f],
                  [/(cros)\s[\w]+\s([\w\.]+\w)/i],
                  [[u, "Chromium OS"], f],
                  [/(sunos)\s?([\w\.\d]*)/i],
                  [[u, "Solaris"], f],
                  [/\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]*)/i],
                  [u, f],
                  [/(haiku)\s(\w+)/i],
                  [u, f],
                  [
                    /cfnetwork\/.+darwin/i,
                    /ip[honead]{2,4}(?:.*os\s([\w]+)\slike\smac|;\sopera)/i,
                  ],
                  [
                    [f, /_/g, "."],
                    [u, "iOS"],
                  ],
                  [
                    /(mac\sos\sx)\s?([\w\s\.]*)/i,
                    /(macintosh|mac(?=_powerpc)\s)/i,
                  ],
                  [
                    [u, "Mac OS"],
                    [f, /_/g, "."],
                  ],
                  [
                    /((?:open)?solaris)[\/\s-]?([\w\.]*)/i,
                    /(aix)\s((\d)(?=\.|\)|\s)[\w\.])*/i,
                    /(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms|fuchsia)/i,
                    /(unix)\s?([\w\.]*)/i,
                  ],
                  [u, f],
                ],
              },
              x = function (e, t) {
                if (
                  ("object" == typeof e && ((t = e), (e = i)),
                  !(this instanceof x))
                )
                  return new x(e, t).getResult();
                var r =
                    e ||
                    (a && a.navigator && a.navigator.userAgent
                      ? a.navigator.userAgent
                      : ""),
                  n = t ? y.extend(M, t) : M;
                return (
                  (this.getBrowser = function () {
                    var e = { name: i, version: i };
                    return (
                      v.rgx.call(e, r, n.browser),
                      (e.major = y.major(e.version)),
                      e
                    );
                  }),
                  (this.getCPU = function () {
                    var e = { architecture: i };
                    return v.rgx.call(e, r, n.cpu), e;
                  }),
                  (this.getDevice = function () {
                    var e = { vendor: i, model: i, type: i };
                    return v.rgx.call(e, r, n.device), e;
                  }),
                  (this.getEngine = function () {
                    var e = { name: i, version: i };
                    return v.rgx.call(e, r, n.engine), e;
                  }),
                  (this.getOS = function () {
                    var e = { name: i, version: i };
                    return v.rgx.call(e, r, n.os), e;
                  }),
                  (this.getResult = function () {
                    return {
                      ua: this.getUA(),
                      browser: this.getBrowser(),
                      engine: this.getEngine(),
                      os: this.getOS(),
                      device: this.getDevice(),
                      cpu: this.getCPU(),
                    };
                  }),
                  (this.getUA = function () {
                    return r;
                  }),
                  (this.setUA = function (e) {
                    return (r = e), this;
                  }),
                  this
                );
              };
            (x.VERSION = "0.7.24"),
              (x.BROWSER = { NAME: u, MAJOR: "major", VERSION: f }),
              (x.CPU = { ARCHITECTURE: h }),
              (x.DEVICE = {
                MODEL: c,
                VENDOR: l,
                TYPE: _,
                CONSOLE: d,
                MOBILE: p,
                SMARTTV: b,
                TABLET: m,
                WEARABLE: g,
                EMBEDDED: "embedded",
              }),
              (x.ENGINE = { NAME: u, VERSION: f }),
              (x.OS = { NAME: u, VERSION: f }),
              void 0 !== t
                ? (e.exports && (t = e.exports = x), (t.UAParser = x))
                : (n = function () {
                    return x;
                  }.call(t, r, t, e)) === i || (e.exports = n);
            var E = a && (a.jQuery || a.Zepto);
            if (E && !E.ua) {
              var k = new x();
              (E.ua = k.getResult()),
                (E.ua.get = function () {
                  return k.getUA();
                }),
                (E.ua.set = function (e) {
                  k.setUA(e);
                  var t = k.getResult();
                  for (var r in t) E.ua[r] = t[r];
                });
            }
          })("object" == typeof window ? window : this);
        },
        9615: (e, t, r) => {
          "use strict";
          r.r(t), r.d(t, { default: () => i });
          var n = r(477),
            a = r.n(n);
          function i() {
            return a()(
              '(()=>{"use strict";var e={810:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.MessageDeserializer=void 0,t.MessageDeserializer=class{constructor(){this._buffer=new ArrayBuffer(0),this._i32View=new Int32Array(this._buffer),this._f32View=new Float32Array(this._buffer),this._f64View=new Float64Array(this._buffer),this._u8View=new Uint8Array(this._buffer),this._u16View=new Uint16Array(this._buffer),this._u32View=new Uint32Array(this._buffer),this._offset=0,this._length=0,this._startOffset=-1,this._processor={int:()=>this._i32View[this._startOffset++],bool:()=>1===this._i32View[this._startOffset++],type:()=>this._i32View[this._startOffset++],float:()=>this._f32View[this._startOffset++],timestamp:()=>{this._startOffset%2==1&&this._startOffset++;let e=this._f64View[this._startOffset/2];return this._startOffset+=2,e},string:()=>{let e=this._i32View[this._startOffset++],t=(new TextDecoder).decode(new Uint8Array(this._buffer,4*this._startOffset,e));return this._startOffset+=e>>2,0!=(3&e)&&this._startOffset++,t},dataWithLength:()=>{let e=this._i32View[this._startOffset++],t=new Uint8Array(e);return t.set(this._u8View.subarray(4*this._startOffset,4*this._startOffset+e)),this._startOffset+=t.byteLength>>2,0!=(3&t.byteLength)&&this._startOffset++,t.buffer},matrix4x4:()=>{let e=this._i32View[this._startOffset++],t=new Float32Array(e);return t.set(this._f32View.subarray(this._startOffset,this._startOffset+16)),this._startOffset+=e,t},identityCoefficients:()=>{let e=this._i32View[this._startOffset++],t=new Float32Array(e);return t.set(this._f32View.subarray(this._startOffset,this._startOffset+50)),this._startOffset+=e,t},expressionCoefficients:()=>{let e=this._i32View[this._startOffset++],t=new Float32Array(e);return t.set(this._f32View.subarray(this._startOffset,this._startOffset+29)),this._startOffset+=e,t},cameraModel:()=>{let e=this._i32View[this._startOffset++],t=new Float32Array(e);return t.set(this._f32View.subarray(this._startOffset,this._startOffset+6)),this._startOffset+=e,t},barcodeFormat:()=>this._i32View[this._startOffset++],faceLandmarkName:()=>this._i32View[this._startOffset++],instantTrackerTransformOrientation:()=>this._i32View[this._startOffset++],logLevel:()=>this._i32View[this._startOffset++]}}setData(e){this._buffer=e,this._i32View=new Int32Array(this._buffer),this._f32View=new Float32Array(this._buffer),this._f64View=new Float64Array(this._buffer),this._u8View=new Uint8Array(this._buffer),this._u16View=new Uint16Array(this._buffer),this._u32View=new Uint32Array(this._buffer),this._offset=0,this._length=0,e.byteLength>=4&&(this._offset=1,this._length=this._i32View[0]),this._startOffset=-1}hasMessage(){return this._offset+1<this._length}forMessages(e){for(;this.hasMessage();){let t=this._i32View[this._offset],r=this._i32View[this._offset+1];this._startOffset=this._offset+2,this._offset+=t,e(r,this._processor)}}}},435:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Event5=t.Event3=t.Event2=t.Event1=t.Event=void 0,t.Event=class{constructor(){this._funcs=[]}bind(e){this._funcs.push(e)}unbind(e){let t=this._funcs.indexOf(e);t>-1&&this._funcs.splice(t,1)}emit(){for(var e=0,t=this._funcs.length;e<t;e++)this._funcs[e]()}},t.Event1=class{constructor(){this._funcs=[]}bind(e){this._funcs.push(e)}unbind(e){let t=this._funcs.indexOf(e);t>-1&&this._funcs.splice(t,1)}emit(e){for(var t=0,r=this._funcs.length;t<r;t++)this._funcs[t](e)}},t.Event2=class{constructor(){this._funcs=[]}bind(e){this._funcs.push(e)}unbind(e){let t=this._funcs.indexOf(e);t>-1&&this._funcs.splice(t,1)}emit(e,t){for(var r=0,n=this._funcs.length;r<n;r++)this._funcs[r](e,t)}},t.Event3=class{constructor(){this._funcs=[]}bind(e){this._funcs.push(e)}unbind(e){let t=this._funcs.indexOf(e);t>-1&&this._funcs.splice(t,1)}emit(e,t,r){for(var n=0,a=this._funcs.length;n<a;n++)this._funcs[n](e,t,r)}},t.Event5=class{constructor(){this._funcs=[]}bind(e){this._funcs.push(e)}unbind(e){let t=this._funcs.indexOf(e);t>-1&&this._funcs.splice(t,1)}emit(e,t,r,n,a){for(var i=0,o=this._funcs.length;i<o;i++)this._funcs[i](e,t,r,n,a)}}},346:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.getRuntimeObject=void 0,t.getRuntimeObject=function(e){let t=e.cwrap("zappar_log_level","number",[]),r=e.cwrap("zappar_log_level_set",null,["number"]),n=e.cwrap("zappar_analytics_project_id_set",null,["string"]),a=e.cwrap("zappar_pipeline_create","number",[]),i=e.cwrap("zappar_pipeline_destroy",null,["number"]),o=e.cwrap("zappar_pipeline_frame_update",null,["number"]),s=e.cwrap("zappar_pipeline_frame_number","number",["number"]),u=e.cwrap("zappar_pipeline_camera_model","number",["number"]),_=e.cwrap("zappar_pipeline_camera_frame_user_data","number",["number"]),c=e.cwrap("zappar_pipeline_camera_frame_submit",null,["number","number","number","number","number","number","number"]),f=e.cwrap("zappar_pipeline_camera_frame_camera_attitude","number",["number"]),l=e.cwrap("zappar_pipeline_motion_accelerometer_submit",null,["number","number","number","number","number"]),p=e.cwrap("zappar_pipeline_motion_rotation_rate_submit",null,["number","number","number","number","number"]),h=e.cwrap("zappar_pipeline_motion_attitude_submit",null,["number","number","number","number","number"]),m=e.cwrap("zappar_camera_source_create","number",["number","string"]),d=e.cwrap("zappar_camera_source_destroy",null,["number"]),b=e.cwrap("zappar_image_tracker_create","number",["number"]),y=e.cwrap("zappar_image_tracker_destroy",null,["number"]),v=e.cwrap("zappar_image_tracker_target_load_from_memory",null,["number","number","number"]),g=e.cwrap("zappar_image_tracker_target_loaded_version","number",["number"]),w=e.cwrap("zappar_image_tracker_target_count","number",["number"]),M=e.cwrap("zappar_image_tracker_enabled","number",["number"]),k=e.cwrap("zappar_image_tracker_enabled_set",null,["number","number"]),z=e.cwrap("zappar_image_tracker_anchor_count","number",["number"]),A=e.cwrap("zappar_image_tracker_anchor_id","string",["number","number"]),x=e.cwrap("zappar_image_tracker_anchor_pose_raw","number",["number","number"]),L=e.cwrap("zappar_face_tracker_create","number",["number"]),E=e.cwrap("zappar_face_tracker_destroy",null,["number"]),C=e.cwrap("zappar_face_tracker_model_load_from_memory",null,["number","number","number"]),O=e.cwrap("zappar_face_tracker_model_loaded_version","number",["number"]),S=e.cwrap("zappar_face_tracker_enabled_set",null,["number","number"]),T=e.cwrap("zappar_face_tracker_enabled","number",["number"]),P=e.cwrap("zappar_face_tracker_max_faces_set",null,["number","number"]),I=e.cwrap("zappar_face_tracker_max_faces","number",["number"]),B=e.cwrap("zappar_face_tracker_anchor_count","number",["number"]),F=e.cwrap("zappar_face_tracker_anchor_id","string",["number","number"]),D=e.cwrap("zappar_face_tracker_anchor_pose_raw","number",["number","number"]),j=e.cwrap("zappar_face_tracker_anchor_identity_coefficients","number",["number","number"]),R=e.cwrap("zappar_face_tracker_anchor_expression_coefficients","number",["number","number"]),V=e.cwrap("zappar_face_mesh_create","number",[]),q=e.cwrap("zappar_face_mesh_destroy",null,["number"]),G=e.cwrap("zappar_face_landmark_create","number",["number"]),N=e.cwrap("zappar_face_landmark_destroy",null,["number"]),U=e.cwrap("zappar_barcode_finder_create","number",["number"]),W=e.cwrap("zappar_barcode_finder_destroy",null,["number"]),H=e.cwrap("zappar_barcode_finder_enabled_set",null,["number","number"]),Z=e.cwrap("zappar_barcode_finder_enabled","number",["number"]),Y=e.cwrap("zappar_barcode_finder_found_number","number",["number"]),X=e.cwrap("zappar_barcode_finder_found_text","string",["number","number"]),K=e.cwrap("zappar_barcode_finder_found_format","number",["number","number"]),J=e.cwrap("zappar_barcode_finder_formats","number",["number"]),Q=e.cwrap("zappar_barcode_finder_formats_set",null,["number","number"]),$=e.cwrap("zappar_instant_world_tracker_create","number",["number"]),ee=e.cwrap("zappar_instant_world_tracker_destroy",null,["number"]),te=e.cwrap("zappar_instant_world_tracker_enabled_set",null,["number","number"]),re=e.cwrap("zappar_instant_world_tracker_enabled","number",["number"]),ne=e.cwrap("zappar_instant_world_tracker_anchor_pose_raw","number",["number"]),ae=e.cwrap("zappar_instant_world_tracker_anchor_pose_set_from_camera_offset",null,["number","number","number","number","number"]),ie=32,oe=e._malloc(ie),se=64,ue=e._malloc(se);return{log_level:()=>t(),log_level_set:e=>r(e),analytics_project_id_set:e=>n(e),pipeline_create:()=>a(),pipeline_destroy:()=>{i()},pipeline_frame_update:e=>o(e),pipeline_frame_number:e=>s(e),pipeline_camera_model:t=>{let r=u(t),n=new Float32Array(6);return n.set(e.HEAPF32.subarray(r/4,6+r/4)),r=n,r},pipeline_camera_frame_user_data:e=>_(e),pipeline_camera_frame_submit:(t,r,n,a,i,o)=>{ie<r.byteLength&&(e._free(oe),ie=r.byteLength,oe=e._malloc(ie));let s=oe,u=r.byteLength;e.HEAPU8.set(new Uint8Array(r),oe);let _=n,f=a,l=i;se<o.byteLength&&(e._free(se),se=o.byteLength,ue=e._malloc(se));let p=ue;return e.HEAPF32.set(o,ue/4),c(t,s,u,_,f,l,p)},pipeline_camera_frame_camera_attitude:t=>{let r=f(t),n=new Float32Array(16);return n.set(e.HEAPF32.subarray(r/4,16+r/4)),r=n,r},pipeline_motion_accelerometer_submit:(e,t,r,n,a)=>l(e,t,r,n,a),pipeline_motion_rotation_rate_submit:(e,t,r,n,a)=>p(e,t,r,n,a),pipeline_motion_attitude_submit:(e,t,r,n,a)=>h(e,t,r,n,a),camera_source_create:(e,t)=>m(e,t),camera_source_destroy:()=>{d()},image_tracker_create:e=>b(e),image_tracker_destroy:()=>{y()},image_tracker_target_load_from_memory:(t,r)=>{ie<r.byteLength&&(e._free(oe),ie=r.byteLength,oe=e._malloc(ie));let n=oe,a=r.byteLength;return e.HEAPU8.set(new Uint8Array(r),oe),v(t,n,a)},image_tracker_target_loaded_version:e=>g(e),image_tracker_target_count:e=>w(e),image_tracker_enabled:e=>{let t=M(e);return t=1===t,t},image_tracker_enabled_set:(e,t)=>k(e,t?1:0),image_tracker_anchor_count:e=>z(e),image_tracker_anchor_id:(e,t)=>A(e,t),image_tracker_anchor_pose_raw:(t,r)=>{let n=x(t,r),a=new Float32Array(16);return a.set(e.HEAPF32.subarray(n/4,16+n/4)),n=a,n},face_tracker_create:e=>L(e),face_tracker_destroy:()=>{E()},face_tracker_model_load_from_memory:(t,r)=>{ie<r.byteLength&&(e._free(oe),ie=r.byteLength,oe=e._malloc(ie));let n=oe,a=r.byteLength;return e.HEAPU8.set(new Uint8Array(r),oe),C(t,n,a)},face_tracker_model_loaded_version:e=>O(e),face_tracker_enabled_set:(e,t)=>S(e,t?1:0),face_tracker_enabled:e=>{let t=T(e);return t=1===t,t},face_tracker_max_faces_set:(e,t)=>P(e,t),face_tracker_max_faces:e=>I(e),face_tracker_anchor_count:e=>B(e),face_tracker_anchor_id:(e,t)=>F(e,t),face_tracker_anchor_pose_raw:(t,r)=>{let n=D(t,r),a=new Float32Array(16);return a.set(e.HEAPF32.subarray(n/4,16+n/4)),n=a,n},face_tracker_anchor_identity_coefficients:(t,r)=>{let n=j(t,r),a=new Float32Array(50);return a.set(e.HEAPF32.subarray(n/4,50+n/4)),n=a,n},face_tracker_anchor_expression_coefficients:(t,r)=>{let n=R(t,r),a=new Float32Array(29);return a.set(e.HEAPF32.subarray(n/4,29+n/4)),n=a,n},face_mesh_create:()=>V(),face_mesh_destroy:()=>{q()},face_landmark_create:e=>G(e),face_landmark_destroy:()=>{N()},barcode_finder_create:e=>U(e),barcode_finder_destroy:()=>{W()},barcode_finder_enabled_set:(e,t)=>H(e,t?1:0),barcode_finder_enabled:e=>{let t=Z(e);return t=1===t,t},barcode_finder_found_number:e=>Y(e),barcode_finder_found_text:(e,t)=>X(e,t),barcode_finder_found_format:(e,t)=>K(e,t),barcode_finder_formats:e=>J(e),barcode_finder_formats_set:(e,t)=>Q(e,t),instant_world_tracker_create:e=>$(e),instant_world_tracker_destroy:()=>{ee()},instant_world_tracker_enabled_set:(e,t)=>te(e,t?1:0),instant_world_tracker_enabled:e=>{let t=re(e);return t=1===t,t},instant_world_tracker_anchor_pose_raw:t=>{let r=ne(t),n=new Float32Array(16);return n.set(e.HEAPF32.subarray(r/4,16+r/4)),r=n,r},instant_world_tracker_anchor_pose_set_from_camera_offset:(e,t,r,n,a)=>ae(e,t,r,n,a)}}},34:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.zappar_server=void 0;const n=r(476),a=r(810);t.zappar_server=class{constructor(e,t){this._impl=e,this._sender=t,this._deserializer=new a.MessageDeserializer,this.serializersByPipelineId=new Map,this._pipeline_id_by_pipeline_id=new Map,this._pipeline_by_instance=new Map,this._pipeline_id_by_camera_source_id=new Map,this._camera_source_by_instance=new Map,this._pipeline_id_by_image_tracker_id=new Map,this._image_tracker_by_instance=new Map,this._pipeline_id_by_face_tracker_id=new Map,this._face_tracker_by_instance=new Map,this._pipeline_id_by_face_mesh_id=new Map,this._face_mesh_by_instance=new Map,this._pipeline_id_by_face_landmark_id=new Map,this._face_landmark_by_instance=new Map,this._pipeline_id_by_barcode_finder_id=new Map,this._barcode_finder_by_instance=new Map,this._pipeline_id_by_instant_world_tracker_id=new Map,this._instant_world_tracker_by_instance=new Map}processBuffer(e){this._deserializer.setData(e),this._deserializer.forMessages(((e,t)=>{switch(e){case 33:this._impl.log_level_set(t.logLevel());break;case 30:this._impl.analytics_project_id_set(t.string());break;case 26:{let e=t.type(),r=this._impl.pipeline_create();this._pipeline_by_instance.set(e,r),this._pipeline_id_by_pipeline_id.set(e,e),this.serializersByPipelineId.set(e,new n.MessageSerializer((t=>{this._sender(e,t)})));break}case 27:{let e=t.type(),r=this._pipeline_by_instance.get(e);if(void 0===r)return;this._impl.pipeline_destroy(r),this._pipeline_by_instance.delete(e);break}case 9:{let e=t.type(),r=this._pipeline_by_instance.get(e);if(void 0===r)return;this._impl.pipeline_frame_update(r);break}case 8:{let e=t.type(),r=this._pipeline_by_instance.get(e);if(void 0===r)return;this._impl.pipeline_camera_frame_submit(r,t.dataWithLength(),t.int(),t.int(),t.int(),t.matrix4x4());break}case 10:{let e=t.type(),r=this._pipeline_by_instance.get(e);if(void 0===r)return;this._impl.pipeline_motion_accelerometer_submit(r,t.timestamp(),t.float(),t.float(),t.float());break}case 11:{let e=t.type(),r=this._pipeline_by_instance.get(e);if(void 0===r)return;this._impl.pipeline_motion_rotation_rate_submit(r,t.timestamp(),t.float(),t.float(),t.float());break}case 12:{let e=t.type(),r=this._pipeline_by_instance.get(e);if(void 0===r)return;this._impl.pipeline_motion_attitude_submit(r,t.timestamp(),t.float(),t.float(),t.float());break}case 28:{let e=t.type(),r=t.type(),n=this._pipeline_by_instance.get(r),a=t.string(),i=this._impl.camera_source_create(n,a);this._camera_source_by_instance.set(e,i),this._pipeline_id_by_camera_source_id.set(e,r);break}case 29:{let e=t.type(),r=this._camera_source_by_instance.get(e);if(void 0===r)return;this._impl.camera_source_destroy(r),this._camera_source_by_instance.delete(e);break}case 2:{let e=t.type(),r=t.type(),n=this._pipeline_by_instance.get(r),a=this._impl.image_tracker_create(n);this._image_tracker_by_instance.set(e,a),this._pipeline_id_by_image_tracker_id.set(e,r);break}case 13:{let e=t.type(),r=this._image_tracker_by_instance.get(e);if(void 0===r)return;this._impl.image_tracker_destroy(r),this._image_tracker_by_instance.delete(e);break}case 4:{let e=t.type(),r=this._image_tracker_by_instance.get(e);if(void 0===r)return;this._impl.image_tracker_target_load_from_memory(r,t.dataWithLength());break}case 3:{let e=t.type(),r=this._image_tracker_by_instance.get(e);if(void 0===r)return;this._impl.image_tracker_enabled_set(r,t.bool());break}case 19:{let e=t.type(),r=t.type(),n=this._pipeline_by_instance.get(r),a=this._impl.face_tracker_create(n);this._face_tracker_by_instance.set(e,a),this._pipeline_id_by_face_tracker_id.set(e,r);break}case 20:{let e=t.type(),r=this._face_tracker_by_instance.get(e);if(void 0===r)return;this._impl.face_tracker_destroy(r),this._face_tracker_by_instance.delete(e);break}case 21:{let e=t.type(),r=this._face_tracker_by_instance.get(e);if(void 0===r)return;this._impl.face_tracker_model_load_from_memory(r,t.dataWithLength());break}case 22:{let e=t.type(),r=this._face_tracker_by_instance.get(e);if(void 0===r)return;this._impl.face_tracker_enabled_set(r,t.bool());break}case 23:{let e=t.type(),r=this._face_tracker_by_instance.get(e);if(void 0===r)return;this._impl.face_tracker_max_faces_set(r,t.int());break}case 24:{let e=t.type(),r=this._impl.face_mesh_create();this._face_mesh_by_instance.set(e,r);break}case 25:{let e=t.type(),r=this._face_mesh_by_instance.get(e);if(void 0===r)return;this._impl.face_mesh_destroy(r),this._face_mesh_by_instance.delete(e);break}case 31:{let e=t.type(),r=t.faceLandmarkName(),n=this._impl.face_landmark_create(r);this._face_landmark_by_instance.set(e,n);break}case 32:{let e=t.type(),r=this._face_landmark_by_instance.get(e);if(void 0===r)return;this._impl.face_landmark_destroy(r),this._face_landmark_by_instance.delete(e);break}case 15:{let e=t.type(),r=t.type(),n=this._pipeline_by_instance.get(r),a=this._impl.barcode_finder_create(n);this._barcode_finder_by_instance.set(e,a),this._pipeline_id_by_barcode_finder_id.set(e,r);break}case 16:{let e=t.type(),r=this._barcode_finder_by_instance.get(e);if(void 0===r)return;this._impl.barcode_finder_destroy(r),this._barcode_finder_by_instance.delete(e);break}case 17:{let e=t.type(),r=this._barcode_finder_by_instance.get(e);if(void 0===r)return;this._impl.barcode_finder_enabled_set(r,t.bool());break}case 18:{let e=t.type(),r=this._barcode_finder_by_instance.get(e);if(void 0===r)return;this._impl.barcode_finder_formats_set(r,t.barcodeFormat());break}case 5:{let e=t.type(),r=t.type(),n=this._pipeline_by_instance.get(r),a=this._impl.instant_world_tracker_create(n);this._instant_world_tracker_by_instance.set(e,a),this._pipeline_id_by_instant_world_tracker_id.set(e,r);break}case 14:{let e=t.type(),r=this._instant_world_tracker_by_instance.get(e);if(void 0===r)return;this._impl.instant_world_tracker_destroy(r),this._instant_world_tracker_by_instance.delete(e);break}case 6:{let e=t.type(),r=this._instant_world_tracker_by_instance.get(e);if(void 0===r)return;this._impl.instant_world_tracker_enabled_set(r,t.bool());break}case 7:{let e=t.type(),r=this._instant_world_tracker_by_instance.get(e);if(void 0===r)return;this._impl.instant_world_tracker_anchor_pose_set_from_camera_offset(r,t.float(),t.float(),t.float(),t.instantTrackerTransformOrientation());break}}}))}exploreState(){for(let[e,t]of this._pipeline_by_instance){let r=this._pipeline_id_by_pipeline_id.get(e);if(!r)continue;let n=this.serializersByPipelineId.get(r);n&&(n.sendMessage(7,(r=>{r.type(e),r.int(this._impl.pipeline_frame_number(t))})),n.sendMessage(6,(r=>{r.type(e),r.cameraModel(this._impl.pipeline_camera_model(t))})),n.sendMessage(5,(r=>{r.type(e),r.int(this._impl.pipeline_camera_frame_user_data(t))})),n.sendMessage(11,(r=>{r.type(e),r.matrix4x4(this._impl.pipeline_camera_frame_camera_attitude(t))})))}for(let[e,t]of this._camera_source_by_instance){let t=this._pipeline_id_by_camera_source_id.get(e);t&&this.serializersByPipelineId.get(t)}for(let[e,t]of this._image_tracker_by_instance){let r=this._pipeline_id_by_image_tracker_id.get(e);if(!r)continue;let n=this.serializersByPipelineId.get(r);if(n){n.sendMessage(18,(r=>{r.type(e),r.int(this._impl.image_tracker_target_loaded_version(t))})),n.sendMessage(20,(r=>{r.type(e),r.int(this._impl.image_tracker_target_count(t))})),n.sendMessage(1,(r=>{r.type(e),r.int(this._impl.image_tracker_anchor_count(t))}));for(let r=0;r<this._impl.image_tracker_anchor_count(t);r++)n.sendMessage(2,(n=>{n.type(e),n.int(r),n.string(this._impl.image_tracker_anchor_id(t,r))}));for(let r=0;r<this._impl.image_tracker_anchor_count(t);r++)n.sendMessage(3,(n=>{n.type(e),n.int(r),n.matrix4x4(this._impl.image_tracker_anchor_pose_raw(t,r))}))}}for(let[e,t]of this._face_tracker_by_instance){let r=this._pipeline_id_by_face_tracker_id.get(e);if(!r)continue;let n=this.serializersByPipelineId.get(r);if(n){n.sendMessage(17,(r=>{r.type(e),r.int(this._impl.face_tracker_model_loaded_version(t))})),n.sendMessage(12,(r=>{r.type(e),r.int(this._impl.face_tracker_anchor_count(t))}));for(let r=0;r<this._impl.face_tracker_anchor_count(t);r++)n.sendMessage(13,(n=>{n.type(e),n.int(r),n.string(this._impl.face_tracker_anchor_id(t,r))}));for(let r=0;r<this._impl.face_tracker_anchor_count(t);r++)n.sendMessage(14,(n=>{n.type(e),n.int(r),n.matrix4x4(this._impl.face_tracker_anchor_pose_raw(t,r))}));for(let r=0;r<this._impl.face_tracker_anchor_count(t);r++)n.sendMessage(15,(n=>{n.type(e),n.int(r),n.identityCoefficients(this._impl.face_tracker_anchor_identity_coefficients(t,r))}));for(let r=0;r<this._impl.face_tracker_anchor_count(t);r++)n.sendMessage(16,(n=>{n.type(e),n.int(r),n.expressionCoefficients(this._impl.face_tracker_anchor_expression_coefficients(t,r))}))}}for(let[e,t]of this._face_mesh_by_instance){let t=this._pipeline_id_by_face_mesh_id.get(e);t&&this.serializersByPipelineId.get(t)}for(let[e,t]of this._face_landmark_by_instance){let t=this._pipeline_id_by_face_landmark_id.get(e);t&&this.serializersByPipelineId.get(t)}for(let[e,t]of this._barcode_finder_by_instance){let r=this._pipeline_id_by_barcode_finder_id.get(e);if(!r)continue;let n=this.serializersByPipelineId.get(r);if(n){n.sendMessage(8,(r=>{r.type(e),r.int(this._impl.barcode_finder_found_number(t))}));for(let r=0;r<this._impl.barcode_finder_found_number(t);r++)n.sendMessage(9,(n=>{n.type(e),n.int(r),n.string(this._impl.barcode_finder_found_text(t,r))}));for(let r=0;r<this._impl.barcode_finder_found_number(t);r++)n.sendMessage(10,(n=>{n.type(e),n.int(r),n.barcodeFormat(this._impl.barcode_finder_found_format(t,r))}))}}for(let[e,t]of this._instant_world_tracker_by_instance){let r=this._pipeline_id_by_instant_world_tracker_id.get(e);if(!r)continue;let n=this.serializersByPipelineId.get(r);n&&n.sendMessage(4,(r=>{r.type(e),r.matrix4x4(this._impl.instant_world_tracker_anchor_pose_raw(t))}))}}}},123:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.MsgManager=void 0;const n=r(435);t.MsgManager=class{constructor(){this.onOutgoingMessage=new n.Event,this.onIncomingMessage=new n.Event1,this._outgoingMessages=[]}postIncomingMessage(e){this.onIncomingMessage.emit(e)}postOutgoingMessage(e,t){this._outgoingMessages.push({msg:e,transferables:t}),this.onOutgoingMessage.emit()}getOutgoingMessages(){let e=this._outgoingMessages;return this._outgoingMessages=[],e}}},476:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.MessageSerializer=void 0,t.MessageSerializer=class{constructor(e){this._messageSender=e,this._freeBufferPool=[],this._buffer=new ArrayBuffer(16),this._i32View=new Int32Array(this._buffer),this._f32View=new Float32Array(this._buffer),this._f64View=new Float64Array(this._buffer),this._u8View=new Uint8Array(this._buffer),this._u8cView=new Uint8ClampedArray(this._buffer),this._u16View=new Uint16Array(this._buffer),this._u32View=new Uint32Array(this._buffer),this._offset=1,this._startOffset=-1,this._timeoutSet=!1,this._appender={int:e=>this.int(e),bool:e=>this.int(e?1:0),float:e=>this.float(e),string:e=>this.string(e),dataWithLength:e=>this.arrayBuffer(e),type:e=>this.int(e),matrix4x4:e=>this.float32ArrayBuffer(e),identityCoefficients:e=>this.float32ArrayBuffer(e),expressionCoefficients:e=>this.float32ArrayBuffer(e),cameraModel:e=>this.float32ArrayBuffer(e),timestamp:e=>this.double(e),barcodeFormat:e=>this.int(e),faceLandmarkName:e=>this.int(e),instantTrackerTransformOrientation:e=>this.int(e),logLevel:e=>this.int(e)},this._freeBufferPool.push(new ArrayBuffer(16)),this._freeBufferPool.push(new ArrayBuffer(16))}bufferReturn(e){this._freeBufferPool.push(e)}_ensureArrayBuffer(e){let t,r=4*(this._offset+e+8);if(this._buffer&&this._buffer.byteLength>=r)return;if(!t){let e=r;e--,e|=e>>1,e|=e>>2,e|=e>>4,e|=e>>8,e|=e>>16,e++,t=new ArrayBuffer(e)}let n=this._buffer?this._i32View:void 0;this._buffer=t,this._i32View=new Int32Array(this._buffer),this._f32View=new Float32Array(this._buffer),this._f64View=new Float64Array(this._buffer),this._u8View=new Uint8Array(this._buffer),this._u8cView=new Uint8ClampedArray(this._buffer),this._u16View=new Uint16Array(this._buffer),this._u32View=new Uint32Array(this._buffer),n&&this._i32View.set(n.subarray(0,this._offset))}sendMessage(e,t){this._ensureArrayBuffer(4),this._startOffset=this._offset,this._i32View[this._offset+1]=e,this._offset+=2,t(this._appender),this._i32View[this._startOffset]=this._offset-this._startOffset,this._startOffset=-1,this._sendOneTime()}_sendOneTime(){!1===this._timeoutSet&&(this._timeoutSet=!0,setTimeout((()=>{this._timeoutSet=!1,this._send()}),0))}_send(){0!==this._freeBufferPool.length?(this._i32View[0]=this._offset,this._messageSender(this._buffer),this._buffer=void 0,this._buffer=this._freeBufferPool.pop(),this._i32View=new Int32Array(this._buffer),this._f32View=new Float32Array(this._buffer),this._f64View=new Float64Array(this._buffer),this._u8View=new Uint8Array(this._buffer),this._u8cView=new Uint8ClampedArray(this._buffer),this._u16View=new Uint16Array(this._buffer),this._u32View=new Uint32Array(this._buffer),this._offset=1,this._startOffset=-1):this._sendOneTime()}int(e){this._ensureArrayBuffer(1),this._i32View[this._offset]=e,this._offset++}double(e){this._ensureArrayBuffer(2),this._offset%2==1&&this._offset++,this._f64View[this._offset/2]=e,this._offset+=2}float(e){this._ensureArrayBuffer(1),this._f32View[this._offset]=e,this._offset++}int32Array(e){this._ensureArrayBuffer(e.length);for(let t=0;t<e.length;++t)this._i32View[this._offset+t]=e[t];this._offset+=e.length}float32Array(e){this._ensureArrayBuffer(e.length);for(let t=0;t<e.length;++t)this._f32View[this._offset+t]=e[t];this._offset+=e.length}booleanArray(e){this._ensureArrayBuffer(e.length);for(let t=0;t<e.length;++t)this._i32View[this._offset+t]=e[t]?1:0;this._offset+=e.length}uint8ArrayBuffer(e){this._ensureArrayBuffer(e.byteLength/4),this._i32View[this._offset]=e.byteLength,this._offset++,this._u8View.set(e,4*this._offset),this._offset+=e.byteLength>>2,0!=(3&e.byteLength)&&this._offset++}arrayBuffer(e){let t=new Uint8Array(e);this.uint8ArrayBuffer(t)}uint8ClampedArrayBuffer(e){this._ensureArrayBuffer(e.byteLength/4),this._i32View[this._offset]=e.byteLength,this._offset++,this._u8cView.set(e,4*this._offset),this._offset+=e.byteLength>>2,0!=(3&e.byteLength)&&this._offset++}float32ArrayBuffer(e){this._ensureArrayBuffer(e.byteLength/4),this._i32View[this._offset]=e.length,this._offset++,this._f32View.set(e,this._offset),this._offset+=e.length}uint16ArrayBuffer(e){this._ensureArrayBuffer(e.byteLength/4),this._i32View[this._offset]=e.length,this._offset++;let t=2*this._offset;this._u16View.set(e,t),this._offset+=e.length>>1,0!=(1&e.length)&&this._offset++}int32ArrayBuffer(e){this._ensureArrayBuffer(e.byteLength/4),this._i32View[this._offset]=e.length,this._offset++,this._i32View.set(e,this._offset),this._offset+=e.length}uint32ArrayBuffer(e){this._ensureArrayBuffer(e.byteLength/4),this._i32View[this._offset]=e.length,this._offset++,this._u32View.set(e,this._offset),this._offset+=e.length}string(e){let t=(new TextEncoder).encode(e);this._ensureArrayBuffer(t.byteLength/4),this._i32View[this._offset]=t.byteLength,this._offset++,this._u8View.set(t,4*this._offset),this._offset+=t.byteLength>>2,0!=(3&t.byteLength)&&this._offset++}}},248:function(e,t,r){var n=this&&this.__awaiter||function(e,t,r,n){return new(r||(r=Promise))((function(a,i){function o(e){try{u(n.next(e))}catch(e){i(e)}}function s(e){try{u(n.throw(e))}catch(e){i(e)}}function u(e){var t;e.done?a(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(o,s)}u((n=n.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0}),t.launchWorkerServer=t.messageManager=void 0;const a=r(206),i=r(346),o=r(34),s=r(123),u=r(887);t.messageManager=new s.MsgManager,t.launchWorkerServer=function(e){return n(this,void 0,void 0,(function*(){let r=a.default({locateFile:(t,r)=>t.endsWith("zcv.wasm")?e:r+t,onRuntimeInitialized:()=>{let e=i.getRuntimeObject(r),n=new o.zappar_server(e,((e,r)=>{t.messageManager.postOutgoingMessage({p:e,t:"zappar",d:r},[r])}));t.messageManager.postOutgoingMessage("loaded",[]),t.messageManager.onIncomingMessage.bind((r=>{var a;switch(r.t){case"zappar":n.processBuffer(r.d),t.messageManager.postOutgoingMessage({t:"buf",d:r.d},[r.d]);break;case"buf":null===(a=n.serializersByPipelineId.get(r.p))||void 0===a||a.bufferReturn(r.d);break;case"cameraFrameC2S":let i=r,o=u.mat4.create();i.userFacing&&u.mat4.fromScaling(o,[-1,1,-1]);let s=n._pipeline_by_instance.get(i.p);s&&(e.pipeline_camera_frame_submit(s,i.d,i.width,i.height,i.token,o),e.pipeline_frame_update(s),n.exploreState());let _={token:i.token,d:i.d,p:i.p,t:"cameraFrameRecycleS2C"};t.messageManager.postOutgoingMessage(_,[i.d])}}))}})}))}},206:(e,t,r)=>{var n;r.r(t),r.d(t,{default:()=>a});const a=(n="undefined"!=typeof document&&document.currentScript?document.currentScript.src:void 0,function(e){var t;e=e||{},t||(t=void 0!==e?e:{});var r,a={};for(r in t)t.hasOwnProperty(r)&&(a[r]=t[r]);t.arguments=[],t.thisProgram="./this.program",t.quit=function(e,t){throw t},t.preRun=[],t.postRun=[];var i="";function o(e){return t.locateFile?t.locateFile(e,i):i+e}i=self.location.href,n&&(i=n),i=0!==i.indexOf("blob:")?i.substr(0,i.lastIndexOf("/")+1):"",t.read=function(e){var t=new XMLHttpRequest;return t.open("GET",e,!1),t.send(null),t.responseText},t.readBinary=function(e){var t=new XMLHttpRequest;return t.open("GET",e,!1),t.responseType="arraybuffer",t.send(null),new Uint8Array(t.response)},t.readAsync=function(e,t,r){var n=new XMLHttpRequest;n.open("GET",e,!0),n.responseType="arraybuffer",n.onload=function(){200==n.status||0==n.status&&n.response?t(n.response):r()},n.onerror=r,n.send(null)},t.setWindowTitle=function(e){document.title=e};var s=t.print||("undefined"!=typeof console?console.log.bind(console):"undefined"!=typeof print?print:null),u=t.printErr||("undefined"!=typeof printErr?printErr:"undefined"!=typeof console&&console.warn.bind(console)||s);for(r in a)a.hasOwnProperty(r)&&(t[r]=a[r]);function _(e){var t=B;return B=B+e+15&-16,t}function c(e){var t=S[V>>2];return e=t+e+15&-16,S[V>>2]=e,e>=Z&&!W()?(S[V>>2]=t,0):t}function f(e){var t;return t||(t=16),Math.ceil(e/t)*t}a=void 0;var l,p={"f64-rem":function(e,t){return e%t},debugger:function(){}},h={};var m=!1;function d(e,t){e||yn("Assertion failed: "+t)}function b(e){var r=t["_"+e];return d(r,"Cannot call unknown function "+e+", make sure it is exported"),r}var y={stackSave:function(){dn()},stackRestore:function(){mn()},arrayToC:function(e){var t=hn(e.length);return L.set(e,t),t},stringToC:function(e){var t=0;if(null!=e&&0!==e){var r=1+(e.length<<2);t=hn(r),z(e,E,t,r)}return t}},v={string:y.stringToC,array:y.arrayToC};function g(e){var t;if(0===t||!e)return"";for(var r,n=0,a=0;n|=r=E[e+a>>0],(0!=r||t)&&(a++,!t||a!=t););if(t||(t=a),r="",128>n){for(;0<t;)n=String.fromCharCode.apply(String,E.subarray(e,e+Math.min(t,1024))),r=r?r+n:n,e+=1024,t-=1024;return r}return k(e)}var w="undefined"!=typeof TextDecoder?new TextDecoder("utf8"):void 0;function M(e,t){for(var r=t;e[r];)++r;if(16<r-t&&e.subarray&&w)return w.decode(e.subarray(t,r));for(r="";;){var n=e[t++];if(!n)return r;if(128&n){var a=63&e[t++];if(192==(224&n))r+=String.fromCharCode((31&n)<<6|a);else{var i=63&e[t++];if(224==(240&n))n=(15&n)<<12|a<<6|i;else{var o=63&e[t++];if(240==(248&n))n=(7&n)<<18|a<<12|i<<6|o;else{var s=63&e[t++];n=248==(252&n)?(3&n)<<24|a<<18|i<<12|o<<6|s:(1&n)<<30|a<<24|i<<18|o<<12|s<<6|63&e[t++]}}65536>n?r+=String.fromCharCode(n):(n-=65536,r+=String.fromCharCode(55296|n>>10,56320|1023&n))}}else r+=String.fromCharCode(n)}}function k(e){return M(E,e)}function z(e,t,r,n){if(!(0<n))return 0;var a=r;n=r+n-1;for(var i=0;i<e.length;++i){var o=e.charCodeAt(i);if(55296<=o&&57343>=o&&(o=65536+((1023&o)<<10)|1023&e.charCodeAt(++i)),127>=o){if(r>=n)break;t[r++]=o}else{if(2047>=o){if(r+1>=n)break;t[r++]=192|o>>6}else{if(65535>=o){if(r+2>=n)break;t[r++]=224|o>>12}else{if(2097151>=o){if(r+3>=n)break;t[r++]=240|o>>18}else{if(67108863>=o){if(r+4>=n)break;t[r++]=248|o>>24}else{if(r+5>=n)break;t[r++]=252|o>>30,t[r++]=128|o>>24&63}t[r++]=128|o>>18&63}t[r++]=128|o>>12&63}t[r++]=128|o>>6&63}t[r++]=128|63&o}}return t[r]=0,r-a}function A(e){for(var t=0,r=0;r<e.length;++r){var n=e.charCodeAt(r);55296<=n&&57343>=n&&(n=65536+((1023&n)<<10)|1023&e.charCodeAt(++r)),127>=n?++t:t=2047>=n?t+2:65535>=n?t+3:2097151>=n?t+4:67108863>=n?t+5:t+6}return t}"undefined"!=typeof TextDecoder&&new TextDecoder("utf-16le");var x,L,E,C,O,S,T,P,I,B,F,D,j,R,V,q=65536,G=16777216;function N(e,t){return 0<e%t&&(e+=t-e%t),e}function U(){t.HEAP8=L=new Int8Array(x),t.HEAP16=C=new Int16Array(x),t.HEAP32=S=new Int32Array(x),t.HEAPU8=E=new Uint8Array(x),t.HEAPU16=O=new Uint16Array(x),t.HEAPU32=T=new Uint32Array(x),t.HEAPF32=P=new Float32Array(x),t.HEAPF64=I=new Float64Array(x)}function W(){var e=t.usingWasm?q:G,r=2147483648-e;if(S[V>>2]>r)return!1;var n=Z;for(Z=Math.max(Z,16777216);Z<S[V>>2];)Z=536870912>=Z?N(2*Z,e):Math.min(N((3*Z+2147483648)/4,e),r);return(e=t.reallocBuffer(Z))&&e.byteLength==Z?(t.buffer=x=e,U(),!0):(Z=n,!1)}B=V=0,t.reallocBuffer||(t.reallocBuffer=function(e){try{var t=L,r=new ArrayBuffer(e);new Int8Array(r).set(t)}catch(e){return!1}return!!cn(r)&&r});try{Function.prototype.call.bind(Object.getOwnPropertyDescriptor(ArrayBuffer.prototype,"byteLength").get)(new ArrayBuffer(4))}catch(Tr){}var H=t.TOTAL_STACK||5242880,Z=t.TOTAL_MEMORY||16777216;function Y(e){for(;0<e.length;){var r=e.shift();if("function"==typeof r)r();else{var n=r.g;"number"==typeof n?void 0===r.P?t.dynCall_v(n):t.dynCall_vi(n,r.P):n(void 0===r.P?null:r.P)}}}Z<H&&u("TOTAL_MEMORY should be larger than TOTAL_STACK, was "+Z+"! (TOTAL_STACK="+H+")"),t.buffer?x=t.buffer:("object"==typeof WebAssembly&&"function"==typeof WebAssembly.Memory?(t.wasmMemory=new WebAssembly.Memory({initial:Z/q}),x=t.wasmMemory.buffer):x=new ArrayBuffer(Z),t.buffer=x),U();var X=[],K=[],J=[],Q=[],$=[],ee=!1;function te(){var e=t.preRun.shift();X.unshift(e)}var re=Math.abs,ne=Math.ceil,ae=Math.floor,ie=Math.min,oe=0,se=null,ue=null;function _e(){oe++,t.monitorRunDependencies&&t.monitorRunDependencies(oe)}function ce(){if(oe--,t.monitorRunDependencies&&t.monitorRunDependencies(oe),0==oe&&(null!==se&&(clearInterval(se),se=null),ue)){var e=ue;ue=null,e()}}function fe(e){return String.prototype.startsWith?e.startsWith("data:application/octet-stream;base64,"):0===e.indexOf("data:application/octet-stream;base64,")}t.preloadedImages={},t.preloadedAudios={},function(){function e(){try{if(t.wasmBinary)return new Uint8Array(t.wasmBinary);if(t.readBinary)return t.readBinary(i);throw"both async and sync fetching of the wasm failed"}catch(e){yn(e)}}function r(){return t.wasmBinary||"function"!=typeof fetch?new Promise((function(t){t(e())})):fetch(i,{credentials:"same-origin"}).then((function(e){if(!e.ok)throw"failed to load wasm binary file at \'"+i+"\'";return e.arrayBuffer()})).catch((function(){return e()}))}function n(e){function n(e){if((c=e.exports).memory){e=c.memory;var r=t.buffer;e.byteLength<r.byteLength&&u("the new buffer in mergeMemory is smaller than the previous one. in native wasm, we should grow memory here"),r=new Int8Array(r),new Int8Array(e).set(r),t.buffer=x=e,U()}t.asm=c,t.usingWasm=!0,ce()}function a(e){n(e.instance)}function o(e){r().then((function(e){return WebAssembly.instantiate(e,_)})).then(e,(function(e){u("failed to asynchronously prepare wasm: "+e),yn(e)}))}if("object"!=typeof WebAssembly)return u("no native wasm support detected"),!1;if(!(t.wasmMemory instanceof WebAssembly.Memory))return u("no native wasm Memory in use"),!1;if(e.memory=t.wasmMemory,_.global={NaN:NaN,Infinity:1/0},_["global.Math"]=Math,_.env=e,_e(),t.instantiateWasm)try{return t.instantiateWasm(_,n)}catch(e){return u("Module.instantiateWasm callback failed with error: "+e),!1}return t.wasmBinary||"function"!=typeof WebAssembly.instantiateStreaming||fe(i)||"function"!=typeof fetch?o(a):WebAssembly.instantiateStreaming(fetch(i,{credentials:"same-origin"}),_).then(a,(function(e){u("wasm streaming compile failed: "+e),u("falling back to ArrayBuffer instantiation"),o(a)})),{}}var a="zcv.wast",i="zcv.wasm",s="zcv.temp.asm.js";fe(a)||(a=o(a)),fe(i)||(i=o(i)),fe(s)||(s=o(s));var _={global:null,env:null,asm2wasm:p,parent:t},c=null;t.asmPreload=t.asm;var f=t.reallocBuffer;t.reallocBuffer=function(e){if("asmjs"===l)var r=f(e);else e:{e=N(e,t.usingWasm?q:G);var n=t.buffer.byteLength;if(t.usingWasm)try{r=-1!==t.wasmMemory.grow((e-n)/65536)?t.buffer=t.wasmMemory.buffer:null;break e}catch(e){r=null;break e}r=void 0}return r};var l="";t.asm=function(e,r){if(!r.table){void 0===(e=t.wasmTableSize)&&(e=1024);var a=t.wasmMaxTableSize;r.table="object"==typeof WebAssembly&&"function"==typeof WebAssembly.Table?void 0!==a?new WebAssembly.Table({initial:e,maximum:a,element:"anyfunc"}):new WebAssembly.Table({initial:e,element:"anyfunc"}):Array(e),t.wasmTable=r.table}return r.__memory_base||(r.__memory_base=t.STATIC_BASE),r.__table_base||(r.__table_base=0),d(r=n(r),"no binaryen method succeeded."),r}}();var le=[function(){if(self.crypto&&self.crypto.getRandomValues){var e=new Uint32Array(1);return self.crypto.getRandomValues(e),e[0]}return 9007199254740991*Math.random()}];B=433632,K.push({g:function(){qr()}},{g:function(){Kr()}},{g:function(){an()}},{g:function(){_n()}},{g:function(){sn()}},{g:function(){Zr()}},{g:function(){Xr()}},{g:function(){Yr()}},{g:function(){Ur()}},{g:function(){Hr()}},{g:function(){Wr()}},{g:function(){on()}},{g:function(){Gr()}},{g:function(){Jr()}},{g:function(){Nr()}},{g:function(){en()}},{g:function(){Qr()}},{g:function(){$r()}},{g:function(){tn()}},{g:function(){rn()}},{g:function(){nn()}}),t.STATIC_BASE=1024,t.STATIC_BUMP=432608;var pe=B;B+=16;var he={};function me(){yn()}function de(){return"undefined"!=typeof dateNow||self.performance&&self.performance.now}var be={I:1,u:2,Fc:3,Bb:4,M:5,ja:6,Ua:7,Zb:8,B:9,ib:10,fa:11,Pc:11,ya:12,W:13,ub:14,lc:15,ga:16,ha:17,Qc:18,Y:19,Z:20,N:21,i:22,Ub:23,wa:24,D:25,Mc:26,vb:27,hc:28,O:29,Cc:30,Nb:31,vc:32,rb:33,zc:34,cc:42,yb:43,jb:44,Eb:45,Fb:46,Gb:47,Mb:48,Nc:49,Xb:50,Db:51,ob:35,$b:37,$a:52,cb:53,Rc:54,Vb:55,eb:56,fb:57,pb:35,gb:59,jc:60,Yb:61,Jc:62,ic:63,dc:64,ec:65,Bc:66,ac:67,Xa:68,Gc:69,kb:70,wc:71,Pb:72,sb:73,bb:74,qc:76,ab:77,Ac:78,Hb:79,Ib:80,Lb:81,Kb:82,Jb:83,kc:38,ia:39,Qb:36,X:40,rc:95,uc:96,nb:104,Wb:105,Ya:97,yc:91,oc:88,fc:92,Dc:108,mb:111,Va:98,lb:103,Tb:101,Rb:100,Kc:110,wb:112,xb:113,Ab:115,Za:114,qb:89,Ob:90,xc:93,Ec:94,Wa:99,Sb:102,Cb:106,mc:107,Lc:109,Oc:87,tb:122,Hc:116,pc:95,bc:123,zb:84,sc:75,hb:125,nc:131,tc:130,Ic:86};function ye(e){return t.___errno_location&&(S[t.___errno_location()>>2]=e),e}function ve(e,t){if(0===e)e=Date.now();else{if(1!==e||!de())return ye(be.i),-1;e=me()}return S[t>>2]=e/1e3|0,S[t+4>>2]=e%1e3*1e6|0,0}var ge=0,we=[],Me={};function ke(e){if(!e||Me[e])return e;for(var t in Me){var r=+t;if(Me[r].ka===e)return r}return e}function ze(e){if(e){var r=Me[e];d(0<r.J),r.J--,0!==r.J||r.L||(r.oa&&t.dynCall_vi(r.oa,e),delete Me[e],Ae(e))}}function Ae(e){try{return fn(e)}catch(e){}}function xe(){var e=we.pop();throw e=ke(e),Me[e].L||(we.push(e),Me[e].L=!0),ge=e,e+" - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch."}var Le={0:"Success",1:"Not super-user",2:"No such file or directory",3:"No such process",4:"Interrupted system call",5:"I/O error",6:"No such device or address",7:"Arg list too long",8:"Exec format error",9:"Bad file number",10:"No children",11:"No more processes",12:"Not enough core",13:"Permission denied",14:"Bad address",15:"Block device required",16:"Mount device busy",17:"File exists",18:"Cross-device link",19:"No such device",20:"Not a directory",21:"Is a directory",22:"Invalid argument",23:"Too many open files in system",24:"Too many open files",25:"Not a typewriter",26:"Text file busy",27:"File too large",28:"No space left on device",29:"Illegal seek",30:"Read only file system",31:"Too many links",32:"Broken pipe",33:"Math arg out of domain of func",34:"Math result not representable",35:"File locking deadlock error",36:"File or path name too long",37:"No record locks available",38:"Function not implemented",39:"Directory not empty",40:"Too many symbolic links",42:"No message of desired type",43:"Identifier removed",44:"Channel number out of range",45:"Level 2 not synchronized",46:"Level 3 halted",47:"Level 3 reset",48:"Link number out of range",49:"Protocol driver not attached",50:"No CSI structure available",51:"Level 2 halted",52:"Invalid exchange",53:"Invalid request descriptor",54:"Exchange full",55:"No anode",56:"Invalid request code",57:"Invalid slot",59:"Bad font file fmt",60:"Device not a stream",61:"No data (for no delay io)",62:"Timer expired",63:"Out of streams resources",64:"Machine is not on the network",65:"Package not installed",66:"The object is remote",67:"The link has been severed",68:"Advertise error",69:"Srmount error",70:"Communication error on send",71:"Protocol error",72:"Multihop attempted",73:"Cross mount point (not really error)",74:"Trying to read unreadable message",75:"Value too large for defined data type",76:"Given log. name not unique",77:"f.d. invalid for this operation",78:"Remote address changed",79:"Can   access a needed shared lib",80:"Accessing a corrupted shared lib",81:".lib section in a.out corrupted",82:"Attempting to link in too many libs",83:"Attempting to exec a shared library",84:"Illegal byte sequence",86:"Streams pipe error",87:"Too many users",88:"Socket operation on non-socket",89:"Destination address required",90:"Message too long",91:"Protocol wrong type for socket",92:"Protocol not available",93:"Unknown protocol",94:"Socket type not supported",95:"Not supported",96:"Protocol family not supported",97:"Address family not supported by protocol family",98:"Address already in use",99:"Address not available",100:"Network interface is not configured",101:"Network is unreachable",102:"Connection reset by network",103:"Connection aborted",104:"Connection reset by peer",105:"No buffer space available",106:"Socket is already connected",107:"Socket is not connected",108:"Can\'t send after socket shutdown",109:"Too many references",110:"Connection timed out",111:"Connection refused",112:"Host is down",113:"Host is unreachable",114:"Socket already connected",115:"Connection already in progress",116:"Stale file handle",122:"Quota exceeded",123:"No medium (in tape drive)",125:"Operation canceled",130:"Previous owner died",131:"State not recoverable"};function Ee(e,t){for(var r=0,n=e.length-1;0<=n;n--){var a=e[n];"."===a?e.splice(n,1):".."===a?(e.splice(n,1),r++):r&&(e.splice(n,1),r--)}if(t)for(;r;r--)e.unshift("..");return e}function Ce(e){var t="/"===e.charAt(0),r="/"===e.substr(-1);return(e=Ee(e.split("/").filter((function(e){return!!e})),!t).join("/"))||t||(e="."),e&&r&&(e+="/"),(t?"/":"")+e}function Oe(e){var t=/^(\\/?|)([\\s\\S]*?)((?:\\.{1,2}|[^\\/]+?|)(\\.[^.\\/]*|))(?:[\\/]*)$/.exec(e).slice(1);return e=t[0],t=t[1],e||t?(t&&(t=t.substr(0,t.length-1)),e+t):"."}function Se(e){if("/"===e)return"/";var t=e.lastIndexOf("/");return-1===t?e:e.substr(t+1)}function Te(){for(var e="",t=!1,r=arguments.length-1;-1<=r&&!t;r--){if("string"!=typeof(t=0<=r?arguments[r]:"/"))throw new TypeError("Arguments to path.resolve must be strings");if(!t)return"";e=t+"/"+e,t="/"===t.charAt(0)}return(t?"/":"")+(e=Ee(e.split("/").filter((function(e){return!!e})),!t).join("/"))||"."}var Pe=[];function Ie(e,t){Pe[e]={input:[],output:[],G:t},it(e,Be)}var Be={open:function(e){var t=Pe[e.node.rdev];if(!t)throw new He(be.Y);e.tty=t,e.seekable=!1},close:function(e){e.tty.G.flush(e.tty)},flush:function(e){e.tty.G.flush(e.tty)},read:function(e,t,r,n){if(!e.tty||!e.tty.G.ra)throw new He(be.ja);for(var a=0,i=0;i<n;i++){try{var o=e.tty.G.ra(e.tty)}catch(e){throw new He(be.M)}if(void 0===o&&0===a)throw new He(be.fa);if(null==o)break;a++,t[r+i]=o}return a&&(e.node.timestamp=Date.now()),a},write:function(e,t,r,n){if(!e.tty||!e.tty.G.da)throw new He(be.ja);var a=0;try{if(0===r&&0===n)e.tty.G.flush(e.tty);else for(;a<n;)e.tty.G.da(e.tty,t[r+a]),a++}catch(e){throw new He(be.M)}return n&&(e.node.timestamp=Date.now()),a}},Fe={ra:function(e){if(!e.input.length){var t=null;if("undefined"!=typeof window&&"function"==typeof window.prompt?null!==(t=window.prompt("Input: "))&&(t+="\\n"):"function"==typeof readline&&null!==(t=readline())&&(t+="\\n"),!t)return null;e.input=Rr(t,!0)}return e.input.shift()},da:function(e,t){null===t||10===t?(s(M(e.output,0)),e.output=[]):0!=t&&e.output.push(t)},flush:function(e){e.output&&0<e.output.length&&(s(M(e.output,0)),e.output=[])}},De={da:function(e,t){null===t||10===t?(u(M(e.output,0)),e.output=[]):0!=t&&e.output.push(t)},flush:function(e){e.output&&0<e.output.length&&(u(M(e.output,0)),e.output=[])}},je={o:null,A:function(){return je.createNode(null,"/",16895,0)},createNode:function(e,t,r,n){if(24576==(61440&r)||4096==(61440&r))throw new He(be.I);return je.o||(je.o={dir:{node:{m:je.c.m,s:je.c.s,lookup:je.c.lookup,R:je.c.R,rename:je.c.rename,unlink:je.c.unlink,rmdir:je.c.rmdir,readdir:je.c.readdir,symlink:je.c.symlink},stream:{F:je.f.F}},file:{node:{m:je.c.m,s:je.c.s},stream:{F:je.f.F,read:je.f.read,write:je.f.write,la:je.f.la,sa:je.f.sa,T:je.f.T}},link:{node:{m:je.c.m,s:je.c.s,readlink:je.c.readlink},stream:{}},na:{node:{m:je.c.m,s:je.c.s},stream:at}}),16384==(61440&(r=Qe(e,t,r,n)).mode)?(r.c=je.o.dir.node,r.f=je.o.dir.stream,r.b={}):32768==(61440&r.mode)?(r.c=je.o.file.node,r.f=je.o.file.stream,r.h=0,r.b=null):40960==(61440&r.mode)?(r.c=je.o.link.node,r.f=je.o.link.stream):8192==(61440&r.mode)&&(r.c=je.o.na.node,r.f=je.o.na.stream),r.timestamp=Date.now(),e&&(e.b[t]=r),r},Ea:function(e){if(e.b&&e.b.subarray){for(var t=[],r=0;r<e.h;++r)t.push(e.b[r]);return t}return e.b},Wc:function(e){return e.b?e.b.subarray?e.b.subarray(0,e.h):new Uint8Array(e.b):new Uint8Array},pa:function(e,t){if(e.b&&e.b.subarray&&t>e.b.length&&(e.b=je.Ea(e),e.h=e.b.length),!e.b||e.b.subarray){var r=e.b?e.b.length:0;r>=t||(t=Math.max(t,r*(1048576>r?2:1.125)|0),0!=r&&(t=Math.max(t,256)),r=e.b,e.b=new Uint8Array(t),0<e.h&&e.b.set(r.subarray(0,e.h),0))}else for(!e.b&&0<t&&(e.b=[]);e.b.length<t;)e.b.push(0)},Ma:function(e,t){if(e.h!=t)if(0==t)e.b=null,e.h=0;else{if(!e.b||e.b.subarray){var r=e.b;e.b=new Uint8Array(new ArrayBuffer(t)),r&&e.b.set(r.subarray(0,Math.min(t,e.h)))}else if(e.b||(e.b=[]),e.b.length>t)e.b.length=t;else for(;e.b.length<t;)e.b.push(0);e.h=t}},c:{m:function(e){var t={};return t.dev=8192==(61440&e.mode)?e.id:1,t.ino=e.id,t.mode=e.mode,t.nlink=1,t.uid=0,t.gid=0,t.rdev=e.rdev,16384==(61440&e.mode)?t.size=4096:32768==(61440&e.mode)?t.size=e.h:40960==(61440&e.mode)?t.size=e.link.length:t.size=0,t.atime=new Date(e.timestamp),t.mtime=new Date(e.timestamp),t.ctime=new Date(e.timestamp),t.Ca=4096,t.blocks=Math.ceil(t.size/t.Ca),t},s:function(e,t){void 0!==t.mode&&(e.mode=t.mode),void 0!==t.timestamp&&(e.timestamp=t.timestamp),void 0!==t.size&&je.Ma(e,t.size)},lookup:function(){throw Ze[be.u]},R:function(e,t,r,n){return je.createNode(e,t,r,n)},rename:function(e,t,r){if(16384==(61440&e.mode)){try{var n=Je(t,r)}catch(e){}if(n)for(var a in n.b)throw new He(be.ia)}delete e.parent.b[e.name],e.name=r,t.b[r]=e,e.parent=t},unlink:function(e,t){delete e.b[t]},rmdir:function(e,t){var r,n=Je(e,t);for(r in n.b)throw new He(be.ia);delete e.b[t]},readdir:function(e){var t,r=[".",".."];for(t in e.b)e.b.hasOwnProperty(t)&&r.push(t);return r},symlink:function(e,t,r){return(e=je.createNode(e,t,41471,0)).link=r,e},readlink:function(e){if(40960!=(61440&e.mode))throw new He(be.i);return e.link}},f:{read:function(e,t,r,n,a){var i=e.node.b;if(a>=e.node.h)return 0;if(d(0<=(e=Math.min(e.node.h-a,n))),8<e&&i.subarray)t.set(i.subarray(a,a+e),r);else for(n=0;n<e;n++)t[r+n]=i[a+n];return e},write:function(e,t,r,n,a,i){if(i=!1,!n)return 0;if((e=e.node).timestamp=Date.now(),t.subarray&&(!e.b||e.b.subarray)){if(i)return e.b=t.subarray(r,r+n),e.h=n;if(0===e.h&&0===a)return e.b=new Uint8Array(t.subarray(r,r+n)),e.h=n;if(a+n<=e.h)return e.b.set(t.subarray(r,r+n),a),n}if(je.pa(e,a+n),e.b.subarray&&t.subarray)e.b.set(t.subarray(r,r+n),a);else for(i=0;i<n;i++)e.b[a+i]=t[r+i];return e.h=Math.max(e.h,a+n),n},F:function(e,t,r){if(1===r?t+=e.position:2===r&&32768==(61440&e.node.mode)&&(t+=e.node.h),0>t)throw new He(be.i);return t},la:function(e,t,r){je.pa(e.node,t+r),e.node.h=Math.max(e.node.h,t+r)},sa:function(e,t,r,n,a,i,o){if(32768!=(61440&e.node.mode))throw new He(be.Y);if(r=e.node.b,2&o||r.buffer!==t&&r.buffer!==t.buffer){if((0<a||a+n<e.node.h)&&(r=r.subarray?r.subarray(a,a+n):Array.prototype.slice.call(r,a,a+n)),e=!0,!(n=ln(n)))throw new He(be.ya);t.set(r,n)}else e=!1,n=r.byteOffset;return{Ka:n,za:e}},T:function(e,t,r,n,a){if(32768!=(61440&e.node.mode))throw new He(be.Y);return 2&a||je.f.write(e,t,0,n,r,!1),0}}};B+=16,B+=16,B+=16;var Re=null,Ve={},qe=[],Ge=1,Ne=null,Ue=!0,We={},He=null,Ze={};function Ye(e,t){if(t=t||{},!(e=Te("/",e)))return{path:"",node:null};var r,n={qa:!0,ea:0};for(r in n)void 0===t[r]&&(t[r]=n[r]);if(8<t.ea)throw new He(be.X);e=Ee(e.split("/").filter((function(e){return!!e})),!1);var a=Re;for(n="/",r=0;r<e.length;r++){var i=r===e.length-1;if(i&&t.parent)break;if(a=Je(a,e[r]),n=Ce(n+"/"+e[r]),a.S&&(!i||i&&t.qa)&&(a=a.S.root),!i||t.aa)for(i=0;40960==(61440&a.mode);)if(a=ft(n),a=Ye(n=Te(Oe(n),a),{ea:t.ea}).node,40<i++)throw new He(be.X)}return{path:n,node:a}}function Xe(e){for(var t;;){if(e===e.parent)return e=e.A.ta,t?"/"!==e[e.length-1]?e+"/"+t:e+t:e;t=t?e.name+"/"+t:e.name,e=e.parent}}function Ke(e,t){for(var r=0,n=0;n<t.length;n++)r=(r<<5)-r+t.charCodeAt(n)|0;return(e+r>>>0)%Ne.length}function Je(e,t){var r;if(r=(r=tt(e,"x"))?r:e.c.lookup?0:be.W)throw new He(r,e);for(r=Ne[Ke(e.id,t)];r;r=r.Ja){var n=r.name;if(r.parent.id===e.id&&n===t)return r}return e.c.lookup(e,t)}function Qe(e,t,r,n){return yt||((yt=function(e,t,r,n){e||(e=this),this.parent=e,this.A=e.A,this.S=null,this.id=Ge++,this.name=t,this.mode=r,this.c={},this.f={},this.rdev=n}).prototype={},Object.defineProperties(yt.prototype,{read:{get:function(){return 365==(365&this.mode)},set:function(e){e?this.mode|=365:this.mode&=-366}},write:{get:function(){return 146==(146&this.mode)},set:function(e){e?this.mode|=146:this.mode&=-147}}})),function(e){var t=Ke(e.parent.id,e.name);e.Ja=Ne[t],Ne[t]=e}(e=new yt(e,t,r,n)),e}var $e={r:0,rs:1052672,"r+":2,w:577,wx:705,xw:705,"w+":578,"wx+":706,"xw+":706,a:1089,ax:1217,xa:1217,"a+":1090,"ax+":1218,"xa+":1218};function et(e){var t=["r","w","rw"][3&e];return 512&e&&(t+="w"),t}function tt(e,t){return Ue||(-1===t.indexOf("r")||292&e.mode)&&(-1===t.indexOf("w")||146&e.mode)&&(-1===t.indexOf("x")||73&e.mode)?0:be.W}function rt(e,t){try{return Je(e,t),be.ha}catch(e){}return tt(e,"wx")}var nt,at={open:function(e){e.f=Ve[e.node.rdev].f,e.f.open&&e.f.open(e)},F:function(){throw new He(be.O)}};function it(e,t){Ve[e]={f:t}}function ot(e,t){var r="/"===t,n=!t;if(r&&Re)throw new He(be.ga);if(!r&&!n){var a=Ye(t,{qa:!1});if(t=a.path,(a=a.node).S)throw new He(be.ga);if(16384!=(61440&a.mode))throw new He(be.Z)}t={type:e,$c:{},ta:t,Ia:[]},(e=e.A(t)).A=t,t.root=e,r?Re=e:a&&(a.S=t,a.A&&a.A.Ia.push(t))}function st(e,t,r){var n=Ye(e,{parent:!0}).node;if(!(e=Se(e))||"."===e||".."===e)throw new He(be.i);var a=rt(n,e);if(a)throw new He(a);if(!n.c.R)throw new He(be.I);return n.c.R(n,e,t,r)}function ut(e){st(e,16895,0)}function _t(e,t,r){void 0===r&&(r=t,t=438),st(e,8192|t,r)}function ct(e,t){if(!Te(e))throw new He(be.u);var r=Ye(t,{parent:!0}).node;if(!r)throw new He(be.u);var n=rt(r,t=Se(t));if(n)throw new He(n);if(!r.c.symlink)throw new He(be.I);r.c.symlink(r,t,e)}function ft(e){if(!(e=Ye(e).node))throw new He(be.u);if(!e.c.readlink)throw new He(be.i);return Te(Xe(e.parent),e.c.readlink(e))}function lt(e,r,n,a){if(""===e)throw new He(be.u);if("string"==typeof r){var i=$e[r];if(void 0===i)throw Error("Unknown file open mode: "+r);r=i}if(n=64&r?4095&(void 0===n?438:n)|32768:0,"object"==typeof e)var o=e;else{e=Ce(e);try{o=Ye(e,{aa:!(131072&r)}).node}catch(e){}}if(i=!1,64&r)if(o){if(128&r)throw new He(be.ha)}else o=st(e,n,0),i=!0;if(!o)throw new He(be.u);if(8192==(61440&o.mode)&&(r&=-513),65536&r&&16384!=(61440&o.mode))throw new He(be.Z);if(!i&&(n=o?40960==(61440&o.mode)?be.X:16384==(61440&o.mode)&&("r"!==et(r)||512&r)?be.N:tt(o,et(r)):be.u))throw new He(n);if(512&r){var s;if(!(s="string"==typeof(n=o)?Ye(n,{aa:!0}).node:n).c.s)throw new He(be.I);if(16384==(61440&s.mode))throw new He(be.N);if(32768!=(61440&s.mode))throw new He(be.i);if(n=tt(s,"w"))throw new He(n);s.c.s(s,{size:0,timestamp:Date.now()})}r&=-641,(a=function(e,t){vt||((vt=function(){}).prototype={},Object.defineProperties(vt.prototype,{object:{get:function(){return this.node},set:function(e){this.node=e}}}));var r,n=new vt;for(r in e)n[r]=e[r];return e=n,t=function(e){for(e=e||0;e<=4096;e++)if(!qe[e])return e;throw new He(be.wa)}(t),e.fd=t,qe[t]=e}({node:o,path:Xe(o),flags:r,seekable:!0,position:0,f:o.f,Sa:[],error:!1},a)).f.open&&a.f.open(a),!t.logReadFiles||1&r||(gt||(gt={}),e in gt||(gt[e]=1,console.log("FS.trackingDelegate error on read file: "+e)));try{We.onOpenFile&&(o=0,1!=(2097155&r)&&(o|=1),0!=(2097155&r)&&(o|=2),We.onOpenFile(e,o))}catch(t){console.log("FS.trackingDelegate[\'onOpenFile\'](\'"+e+"\', flags) threw an exception: "+t.message)}return a}function pt(e){if(null===e.fd)throw new He(be.B);e.ba&&(e.ba=null);try{e.f.close&&e.f.close(e)}catch(e){throw e}finally{qe[e.fd]=null}e.fd=null}function ht(e,t,r){if(null===e.fd)throw new He(be.B);if(!e.seekable||!e.f.F)throw new He(be.O);e.position=e.f.F(e,t,r),e.Sa=[]}function mt(){He||((He=function(e,t){this.node=t,this.Na=function(e){for(var t in this.v=e,be)if(be[t]===e){this.code=t;break}},this.Na(e),this.message=Le[e],this.stack&&Object.defineProperty(this,"stack",{value:Error().stack,writable:!0})}).prototype=Error(),He.prototype.constructor=He,[be.u].forEach((function(e){Ze[e]=new He(e),Ze[e].stack="<generic error, no stack>"})))}function dt(e,t,r){e=Ce("/dev/"+e);var n=function(e,t){var r=0;return e&&(r|=365),t&&(r|=146),r}(!!t,!!r);bt||(bt=64);var a=bt++<<8|0;it(a,{open:function(e){e.seekable=!1},close:function(){r&&r.buffer&&r.buffer.length&&r(10)},read:function(e,r,n,a){for(var i=0,o=0;o<a;o++){try{var s=t()}catch(e){throw new He(be.M)}if(void 0===s&&0===i)throw new He(be.fa);if(null==s)break;i++,r[n+o]=s}return i&&(e.node.timestamp=Date.now()),i},write:function(e,t,n,a){for(var i=0;i<a;i++)try{r(t[n+i])}catch(e){throw new He(be.M)}return a&&(e.node.timestamp=Date.now()),i}}),_t(e,n,a)}var bt,yt,vt,gt,wt={},Mt={},kt=0;function zt(){return S[(kt+=4)-4>>2]}function At(){var e=qe[zt()];if(!e)throw new He(be.B);return e}function xt(e,r){if(Ft=e,Dt=r,!It)return 1;if(0==e)St=function(){var e=0|Math.max(0,Et+r-me());setTimeout(Ct,e)},Tt="timeout";else if(1==e)St=function(){Qt(Ct)},Tt="rAF";else if(2==e){if("undefined"==typeof setImmediate){var n=[];addEventListener("message",(function(e){"setimmediate"!==e.data&&"setimmediate"!==e.data.target||(e.stopPropagation(),n.shift()())}),!0),setImmediate=function(e){n.push(e),void 0===t.setImmediates&&(t.setImmediates=[]),t.setImmediates.push(e),postMessage({target:"setimmediate"})}}St=function(){setImmediate(Ct)},Tt="immediate"}return 0}function Lt(e,r,n,a,i){t.noExitRuntime=!0,d(!It,"emscripten_set_main_loop: there can only be one main loop function at once: call emscripten_cancel_main_loop to cancel the previous one before setting a new one with different parameters."),It=e,Bt=a;var o=void 0!==a?function(){t.dynCall_vi(e,a)}:function(){t.dynCall_v(e)},s=Pt;if(Ct=function(){if(!m)if(0<Rt.length){var e=Date.now(),r=Rt.shift();if(r.g(r.P),Ot){var n=Ot,a=0==n%1?n-1:Math.floor(n);Ot=r.Tc?a:(8*n+(a+.5))/9}console.log(\'main loop blocker "\'+r.name+\'" took \'+(Date.now()-e)+" ms"),t.setStatus&&(e=t.statusMessage||"Please wait...",r=Ot,n=Vt.Vc,r?r<n?t.setStatus(e+" ("+(n-r)+"/"+n+")"):t.setStatus(e):t.setStatus("")),s<Pt||setTimeout(Ct,0)}else if(!(s<Pt))if(jt=jt+1|0,1==Ft&&1<Dt&&0!=jt%Dt)St();else{if(0==Ft&&(Et=me()),"timeout"===Tt&&t.K&&(u("Looks like you are rendering without using requestAnimationFrame for the main loop. You should use 0 for the frame rate in emscripten_set_main_loop in order to use requestAnimationFrame, as that can greatly improve your frame rates!"),Tt=""),!(m||t.preMainLoop&&!1===t.preMainLoop())){try{o()}catch(e){throw e&&"object"==typeof e&&e.stack&&u("exception thrown: "+[e,e.stack]),e}t.postMainLoop&&t.postMainLoop()}s<Pt||("object"==typeof SDL&&SDL.audio&&SDL.audio.La&&SDL.audio.La(),St())}},i||(r&&0<r?xt(0,1e3/r):xt(1,1),St()),n)throw"SimulateInfiniteLoop"}var Et,Ct,Ot,St=null,Tt="",Pt=0,It=null,Bt=0,Ft=0,Dt=0,jt=0,Rt=[],Vt={},qt=!1,Gt=!1,Nt=[];function Ut(e,r,n,a){if(r&&t.K&&e==t.canvas)return t.K;if(r){var i={antialias:!1,alpha:!1};if(a)for(var o in a)i[o]=a[o];if(i=function(e,t){function r(){}void 0===t.majorVersion&&void 0===t.minorVersion&&(t.majorVersion=1,t.minorVersion=0);try{e.addEventListener("webglcontextcreationerror",r,!1);try{if(1==t.majorVersion&&0==t.minorVersion)var n=e.getContext("webgl",t)||e.getContext("experimental-webgl",t);else{if(2!=t.majorVersion||0!=t.minorVersion)throw"Unsupported WebGL context version "+majorVersion+"."+minorVersion+"!";n=e.getContext("webgl2",t)}}finally{e.removeEventListener("webglcontextcreationerror",r,!1)}if(!n)throw":("}catch(e){return 0}return n?function(e,t){var r=zr(wr),n={handle:r,attributes:t,version:t.majorVersion,GLctx:e};return e.canvas&&(e.canvas.Sc=n),wr[r]=n,(void 0===t.enableExtensionsByDefault||t.enableExtensionsByDefault)&&function(e){if(e||(e=Mr),!e.Ga){e.Ga=!0;var t=e.GLctx;if(2>e.version){var r=t.getExtension("ANGLE_instanced_arrays");r&&(t.vertexAttribDivisor=function(e,t){r.vertexAttribDivisorANGLE(e,t)},t.drawArraysInstanced=function(e,t,n,a){r.drawArraysInstancedANGLE(e,t,n,a)},t.drawElementsInstanced=function(e,t,n,a,i){r.drawElementsInstancedANGLE(e,t,n,a,i)});var n=t.getExtension("OES_vertex_array_object");n&&(t.createVertexArray=function(){return n.createVertexArrayOES()},t.deleteVertexArray=function(e){n.deleteVertexArrayOES(e)},t.bindVertexArray=function(e){n.bindVertexArrayOES(e)},t.isVertexArray=function(e){return n.isVertexArrayOES(e)});var a=t.getExtension("WEBGL_draw_buffers");a&&(t.drawBuffers=function(e,t){a.drawBuffersWEBGL(e,t)})}t.Uc=t.getExtension("EXT_disjoint_timer_query");var i="OES_texture_float OES_texture_half_float OES_standard_derivatives OES_vertex_array_object WEBGL_compressed_texture_s3tc WEBGL_depth_texture OES_element_index_uint EXT_texture_filter_anisotropic EXT_frag_depth WEBGL_draw_buffers ANGLE_instanced_arrays OES_texture_float_linear OES_texture_half_float_linear EXT_blend_minmax EXT_shader_texture_lod WEBGL_compressed_texture_pvrtc EXT_color_buffer_half_float WEBGL_color_buffer_float EXT_sRGB WEBGL_compressed_texture_etc1 EXT_disjoint_timer_query WEBGL_compressed_texture_etc WEBGL_compressed_texture_astc EXT_color_buffer_float WEBGL_compressed_texture_s3tc_srgb EXT_disjoint_timer_query_webgl2".split(" ");(e=t.getSupportedExtensions())&&0<e.length&&t.getSupportedExtensions().forEach((function(e){-1!=i.indexOf(e)&&t.getExtension(e)}))}}(n),r}(n,t):0}(e,i))var s=wr[i].GLctx}else s=e.getContext("2d");return s?(n&&(r||d(void 0===Dr,"cannot set in module if GLctx is used, but we are a non-GL context that would replace it"),t.K=s,r&&function(e){e?(e=wr[e])&&(Dr=t.K=e.GLctx,Mr=e):Dr=t.K=Mr=null}(i),t.bd=r,Nt.forEach((function(e){e()})),function(){function e(){Gt=document.pointerLockElement===t.canvas||document.mozPointerLockElement===t.canvas||document.webkitPointerLockElement===t.canvas||document.msPointerLockElement===t.canvas}if(t.preloadPlugins||(t.preloadPlugins=[]),!ar){ar=!0;try{ir=!0}catch(e){ir=!1,console.log("warning: no blob constructor, cannot create blobs with mimetypes")}or="undefined"!=typeof MozBlobBuilder?MozBlobBuilder:"undefined"!=typeof WebKitBlobBuilder?WebKitBlobBuilder:ir?null:console.log("warning: no BlobBuilder"),sr="undefined"!=typeof window?window.URL?window.URL:window.webkitURL:void 0,t.ua||void 0!==sr||(console.log("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available."),t.ua=!0),t.preloadPlugins.push({canHandle:function(e){return!t.ua&&/\\.(jpg|jpeg|png|bmp)$/i.test(e)},handle:function(e,r,n,a){var i=null;if(ir)try{(i=new Blob([e],{type:er(r)})).size!==e.length&&(i=new Blob([new Uint8Array(e).buffer],{type:er(r)}))}catch(e){!function(e){l||(l={}),l[e]||(l[e]=1,u(e))}("Blob constructor present but fails: "+e+"; falling back to blob builder")}i||((i=new or).append(new Uint8Array(e).buffer),i=i.getBlob());var o=sr.createObjectURL(i),s=new Image;s.onload=function(){d(s.complete,"Image "+r+" could not be decoded");var a=document.createElement("canvas");a.width=s.width,a.height=s.height,a.getContext("2d").drawImage(s,0,0),t.preloadedImages[r]=a,sr.revokeObjectURL(o),n&&n(e)},s.onerror=function(){console.log("Image "+o+" could not be decoded"),a&&a()},s.src=o}}),t.preloadPlugins.push({canHandle:function(e){return!t.Zc&&e.substr(-4)in{".ogg":1,".wav":1,".mp3":1}},handle:function(e,r,n,a){function i(a){s||(s=!0,t.preloadedAudios[r]=a,n&&n(e))}function o(){s||(s=!0,t.preloadedAudios[r]=new Audio,a&&a())}var s=!1;if(!ir)return o();try{var u=new Blob([e],{type:er(r)})}catch(e){return o()}u=sr.createObjectURL(u);var _=new Audio;_.addEventListener("canplaythrough",(function(){i(_)}),!1),_.onerror=function(){if(!s){console.log("warning: browser could not fully decode audio "+r+", trying slower base64 approach");for(var t="",n=0,a=0,o=0;o<e.length;o++)for(n=n<<8|e[o],a+=8;6<=a;){var u=n>>a-6&63;a-=6,t+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[u]}2==a?(t+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[(3&n)<<4],t+="=="):4==a&&(t+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[(15&n)<<2],t+="="),_.src="data:audio/x-"+r.substr(-3)+";base64,"+t,i(_)}},_.src=u,$t((function(){i(_)}),1e4)}});var r=t.canvas;r&&(r.requestPointerLock=r.requestPointerLock||r.mozRequestPointerLock||r.webkitRequestPointerLock||r.msRequestPointerLock||function(){},r.exitPointerLock=document.exitPointerLock||document.mozExitPointerLock||document.webkitExitPointerLock||document.msExitPointerLock||function(){},r.exitPointerLock=r.exitPointerLock.bind(document),document.addEventListener("pointerlockchange",e,!1),document.addEventListener("mozpointerlockchange",e,!1),document.addEventListener("webkitpointerlockchange",e,!1),document.addEventListener("mspointerlockchange",e,!1),t.elementPointerLock&&r.addEventListener("click",(function(e){!Gt&&t.canvas.requestPointerLock&&(t.canvas.requestPointerLock(),e.preventDefault())}),!1))}}()),s):null}var Wt=!1,Ht=void 0,Zt=void 0;function Yt(e,r,n){function a(){qt=!1;var e=i.parentNode;(document.fullscreenElement||document.mozFullScreenElement||document.msFullscreenElement||document.webkitFullscreenElement||document.webkitCurrentFullScreenElement)===e?(i.exitFullscreen=document.exitFullscreen||document.cancelFullScreen||document.mozCancelFullScreen||document.msExitFullscreen||document.webkitCancelFullScreen||function(){},i.exitFullscreen=i.exitFullscreen.bind(document),Ht&&i.requestPointerLock(),qt=!0,Zt?("undefined"!=typeof SDL&&(S[SDL.screen>>2]=8388608|T[SDL.screen>>2]),nr(t.canvas),rr()):nr(i)):(e.parentNode.insertBefore(i,e),e.parentNode.removeChild(e),Zt?("undefined"!=typeof SDL&&(S[SDL.screen>>2]=-8388609&T[SDL.screen>>2]),nr(t.canvas),rr()):nr(i)),t.onFullScreen&&t.onFullScreen(qt),t.onFullscreen&&t.onFullscreen(qt)}void 0===(Ht=e)&&(Ht=!0),void 0===(Zt=r)&&(Zt=!1);var i=t.canvas;Wt||(Wt=!0,document.addEventListener("fullscreenchange",a,!1),document.addEventListener("mozfullscreenchange",a,!1),document.addEventListener("webkitfullscreenchange",a,!1),document.addEventListener("MSFullscreenChange",a,!1));var o=document.createElement("div");i.parentNode.insertBefore(o,i),o.appendChild(i),o.requestFullscreen=o.requestFullscreen||o.mozRequestFullScreen||o.msRequestFullscreen||(o.webkitRequestFullscreen?function(){o.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)}:null)||(o.webkitRequestFullScreen?function(){o.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)}:null),n?o.requestFullscreen({cd:n}):o.requestFullscreen()}function Xt(e,t,r){return u("Browser.requestFullScreen() is deprecated. Please call Browser.requestFullscreen instead."),Xt=function(e,t,r){return Yt(e,t,r)},Yt(e,t,r)}var Kt=0;function Jt(e){var t=Date.now();if(0===Kt)Kt=t+1e3/60;else for(;t+2>=Kt;)Kt+=1e3/60;setTimeout(e,Math.max(Kt-t,0))}function Qt(e){"undefined"==typeof window?Jt(e):(window.requestAnimationFrame||(window.requestAnimationFrame=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame||window.oRequestAnimationFrame||Jt),window.requestAnimationFrame(e))}function $t(e,r){t.noExitRuntime=!0,setTimeout((function(){m||e()}),r)}function er(e){return{jpg:"image/jpeg",jpeg:"image/jpeg",png:"image/png",bmp:"image/bmp",ogg:"audio/ogg",wav:"audio/wav",mp3:"audio/mpeg"}[e.substr(e.lastIndexOf(".")+1)]}var tr=[];function rr(){var e=t.canvas;tr.forEach((function(t){t(e.width,e.height)}))}function nr(e,r,n){r&&n?(e.Ta=r,e.Fa=n):(r=e.Ta,n=e.Fa);var a=r,i=n;if(t.forcedAspectRatio&&0<t.forcedAspectRatio&&(a/i<t.forcedAspectRatio?a=Math.round(i*t.forcedAspectRatio):i=Math.round(a/t.forcedAspectRatio)),(document.fullscreenElement||document.mozFullScreenElement||document.msFullscreenElement||document.webkitFullscreenElement||document.webkitCurrentFullScreenElement)===e.parentNode&&"undefined"!=typeof screen){var o=Math.min(screen.width/a,screen.height/i);a=Math.round(a*o),i=Math.round(i*o)}Zt?(e.width!=a&&(e.width=a),e.height!=i&&(e.height=i),void 0!==e.style&&(e.style.removeProperty("width"),e.style.removeProperty("height"))):(e.width!=r&&(e.width=r),e.height!=n&&(e.height=n),void 0!==e.style&&(a!=r||i!=n?(e.style.setProperty("width",a+"px","important"),e.style.setProperty("height",i+"px","important")):(e.style.removeProperty("width"),e.style.removeProperty("height"))))}var ar,ir,or,sr,ur=[],_r=void 0;function cr(e,t){T[e>>2]=t,T[e+4>>2]=t/4294967296|0}function fr(e,t,r,n){var a=T[e+8>>2];if(a){var i=g(a),o=e+112,s=g(o);s||(s="GET");var u=T[o+48>>2],_=T[o+52>>2],c=!!T[o+56>>2],f=T[o+64>>2],l=T[o+68>>2];a=T[o+72>>2];var p=T[o+76>>2],h=T[o+80>>2];o=T[o+84>>2];var m=!!(1&u),d=!!(2&u);u=!!(64&u),f=f?g(f):void 0,l=l?g(l):void 0;var b=p?g(p):void 0,y=new XMLHttpRequest;if(y.withCredentials=c,y.open(s,i,!u,f,l),u||(y.timeout=_),y.l=i,y.responseType=d?"moz-chunked-arraybuffer":"arraybuffer",p&&y.overrideMimeType(b),a)for(;(s=T[a>>2])&&(i=T[a+4>>2]);)a+=8,s=g(s),i=g(i),y.setRequestHeader(s,i);ur.push(y),T[e+0>>2]=ur.length,a=h&&o?E.slice(h,h+o):null,y.onload=function(n){var a=y.response?y.response.byteLength:0,i=0,o=0;m&&!d&&(i=ln(o=a),E.set(new Uint8Array(y.response),i)),T[e+12>>2]=i,cr(e+16,o),cr(e+24,0),a&&cr(e+32,a),O[e+40>>1]=y.readyState,4===y.readyState&&0===y.status&&(y.status=0<a?200:404),O[e+42>>1]=y.status,y.statusText&&z(y.statusText,E,e+44,64),200==y.status?t&&t(e,y,n):r&&r(e,y,n)},y.onerror=function(t){var n=y.status;4==y.readyState&&0==n&&(n=404),T[e+12>>2]=0,cr(e+16,0),cr(e+24,0),cr(e+32,0),O[e+40>>1]=y.readyState,O[e+42>>1]=n,r&&r(e,y,t)},y.ontimeout=function(t){r&&r(e,y,t)},y.onprogress=function(t){var r=m&&d&&y.response?y.response.byteLength:0,a=0;m&&d&&(a=ln(r),E.set(new Uint8Array(y.response),a)),T[e+12>>2]=a,cr(e+16,r),cr(e+24,t.loaded-r),cr(e+32,t.total),O[e+40>>1]=y.readyState,3<=y.readyState&&0===y.status&&0<t.loaded&&(y.status=200),O[e+42>>1]=y.status,y.statusText&&z(y.statusText,E,e+44,64),n&&n(e,y,t)};try{y.send(a)}catch(t){r&&r(e,y,t)}}else r(e,0,"no url specified!")}function lr(e,t,r,n,a){if(e){var i=T[t+112+60>>2];i||(i=T[t+8>>2]);var o=g(i);try{var s=e.transaction(["FILES"],"readwrite").objectStore("FILES").put(r,o);s.onsuccess=function(){O[t+40>>1]=4,O[t+42>>1]=200,z("OK",E,t+44,64),n(t,0,o)},s.onerror=function(e){O[t+40>>1]=4,O[t+42>>1]=413,z("Payload Too Large",E,t+44,64),a(t,0,e)}}catch(e){a(t,0,e)}}else a(t,0,"IndexedDB not available!")}function pr(e,t,r,n){if(e){var a=T[t+112+60>>2];a||(a=T[t+8>>2]),a=g(a);try{var i=e.transaction(["FILES"],"readonly").objectStore("FILES").get(a);i.onsuccess=function(e){if(e.target.result){var a=(e=e.target.result).byteLength||e.length,i=ln(a);E.set(new Uint8Array(e),i),T[t+12>>2]=i,cr(t+16,a),cr(t+24,0),cr(t+32,a),O[t+40>>1]=4,O[t+42>>1]=200,z("OK",E,t+44,64),r(t,0,e)}else O[t+40>>1]=4,O[t+42>>1]=404,z("Not Found",E,t+44,64),n(t,0,"no data")},i.onerror=function(e){O[t+40>>1]=4,O[t+42>>1]=404,z("Not Found",E,t+44,64),n(t,0,e)}}catch(e){n(t,0,e)}}else n(t,0,"IndexedDB not available!")}function hr(e,t,r,n){if(e){var a=T[t+112+60>>2];a||(a=T[t+8>>2]),a=g(a);try{var i=e.transaction(["FILES"],"readwrite").objectStore("FILES").delete(a);i.onsuccess=function(e){e=e.target.result,T[t+12>>2]=0,cr(t+16,0),cr(t+24,0),cr(t+24,0),O[t+40>>1]=4,O[t+42>>1]=200,z("OK",E,t+44,64),r(t,0,e)},i.onerror=function(e){O[t+40>>1]=4,O[t+42>>1]=404,z("Not Found",E,t+44,64),n(t,0,e)}}catch(e){n(t,0,e)}}else n(t,0,"IndexedDB not available!")}var mr,dr,br=void 0;for(br=mr=_(Math.max(12,1)),d(0==(3&mr)),dr=mr+12;br<dr;br+=4)S[br>>2]=0;for(dr=mr+12;br<dr;)L[br++>>0]=0;var yr=1,vr=0,gr=[],wr=[],Mr=null,kr=[];function zr(e){for(var t=yr++,r=e.length;r<t;r++)e[r]=null;return t}function Ar(e,t,r,n){return e*=r,n*=Math.floor((e+n-1)/n),0>=t?0:(t-1)*n+e}function xr(e,t,r,n,a){switch(t){case 6406:case 6409:case 6402:t=1;break;case 6410:t=2;break;case 6407:case 35904:t=3;break;case 6408:case 35906:t=4;break;default:return vr||(vr=1280),null}switch(e){case 5121:t*=1;break;case 5123:case 36193:t*=2;break;case 5125:case 5126:t*=4;break;case 34042:t=4;break;case 33635:case 32819:case 32820:t=2;break;default:return vr||(vr=1280),null}switch(r=Ar(r,n,t,4),e){case 5121:return E.subarray(a,a+r);case 5126:return P.subarray(a>>2,a+r>>2);case 5125:case 34042:return T.subarray(a>>2,a+r>>2);case 5123:case 33635:case 32819:case 32820:case 36193:return O.subarray(a>>1,a+r>>1);default:return vr||(vr=1280),null}}function Lr(){return Lr.l||(Lr.l=[]),Lr.l.push(dn()),Lr.l.length-1}var Er={},Cr=1;function Or(e){return 0==e%4&&(0!=e%100||0==e%400)}function Sr(e,t){for(var r=0,n=0;n<=t;r+=e[n++]);return r}var Tr,Pr=[31,29,31,30,31,30,31,31,30,31,30,31],Ir=[31,28,31,30,31,30,31,31,30,31,30,31];function Br(e,t){for(e=new Date(e.getTime());0<t;){var r=e.getMonth(),n=(Or(e.getFullYear())?Pr:Ir)[r];if(!(t>n-e.getDate())){e.setDate(e.getDate()+t);break}t-=n-e.getDate()+1,e.setDate(1),11>r?e.setMonth(r+1):(e.setMonth(0),e.setFullYear(e.getFullYear()+1))}return e}function Fr(e,t,r,n){function a(e,t,r){for(e="number"==typeof e?e.toString():e||"";e.length<t;)e=r[0]+e;return e}function i(e,t){return a(e,t,"0")}function o(e,t){function r(e){return 0>e?-1:0<e?1:0}var n;return 0===(n=r(e.getFullYear()-t.getFullYear()))&&0===(n=r(e.getMonth()-t.getMonth()))&&(n=r(e.getDate()-t.getDate())),n}function s(e){switch(e.getDay()){case 0:return new Date(e.getFullYear()-1,11,29);case 1:return e;case 2:return new Date(e.getFullYear(),0,3);case 3:return new Date(e.getFullYear(),0,2);case 4:return new Date(e.getFullYear(),0,1);case 5:return new Date(e.getFullYear()-1,11,31);case 6:return new Date(e.getFullYear()-1,11,30)}}function u(e){e=Br(new Date(e.j+1900,0,1),e.V);var t=s(new Date(e.getFullYear()+1,0,4));return 0>=o(s(new Date(e.getFullYear(),0,4)),e)?0>=o(t,e)?e.getFullYear()+1:e.getFullYear():e.getFullYear()-1}var _=S[n+40>>2];for(var c in n={Qa:S[n>>2],Pa:S[n+4>>2],U:S[n+8>>2],H:S[n+12>>2],C:S[n+16>>2],j:S[n+20>>2],va:S[n+24>>2],V:S[n+28>>2],ad:S[n+32>>2],Oa:S[n+36>>2],Ra:_?g(_):""},r=g(r),_={"%c":"%a %b %d %H:%M:%S %Y","%D":"%m/%d/%y","%F":"%Y-%m-%d","%h":"%b","%r":"%I:%M:%S %p","%R":"%H:%M","%T":"%H:%M:%S","%x":"%m/%d/%y","%X":"%H:%M:%S"})r=r.replace(new RegExp(c,"g"),_[c]);var f="Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),l="January February March April May June July August September October November December".split(" ");for(c in _={"%a":function(e){return f[e.va].substring(0,3)},"%A":function(e){return f[e.va]},"%b":function(e){return l[e.C].substring(0,3)},"%B":function(e){return l[e.C]},"%C":function(e){return i((e.j+1900)/100|0,2)},"%d":function(e){return i(e.H,2)},"%e":function(e){return a(e.H,2," ")},"%g":function(e){return u(e).toString().substring(2)},"%G":function(e){return u(e)},"%H":function(e){return i(e.U,2)},"%I":function(e){return 0==(e=e.U)?e=12:12<e&&(e-=12),i(e,2)},"%j":function(e){return i(e.H+Sr(Or(e.j+1900)?Pr:Ir,e.C-1),3)},"%m":function(e){return i(e.C+1,2)},"%M":function(e){return i(e.Pa,2)},"%n":function(){return"\\n"},"%p":function(e){return 0<=e.U&&12>e.U?"AM":"PM"},"%S":function(e){return i(e.Qa,2)},"%t":function(){return"\\t"},"%u":function(e){return new Date(e.j+1900,e.C+1,e.H,0,0,0,0).getDay()||7},"%U":function(e){var t=new Date(e.j+1900,0,1),r=0===t.getDay()?t:Br(t,7-t.getDay());return 0>o(r,e=new Date(e.j+1900,e.C,e.H))?i(Math.ceil((31-r.getDate()+(Sr(Or(e.getFullYear())?Pr:Ir,e.getMonth()-1)-31)+e.getDate())/7),2):0===o(r,t)?"01":"00"},"%V":function(e){var t=s(new Date(e.j+1900,0,4)),r=s(new Date(e.j+1901,0,4)),n=Br(new Date(e.j+1900,0,1),e.V);return 0>o(n,t)?"53":0>=o(r,n)?"01":i(Math.ceil((t.getFullYear()<e.j+1900?e.V+32-t.getDate():e.V+1-t.getDate())/7),2)},"%w":function(e){return new Date(e.j+1900,e.C+1,e.H,0,0,0,0).getDay()},"%W":function(e){var t=new Date(e.j,0,1),r=1===t.getDay()?t:Br(t,0===t.getDay()?1:7-t.getDay()+1);return 0>o(r,e=new Date(e.j+1900,e.C,e.H))?i(Math.ceil((31-r.getDate()+(Sr(Or(e.getFullYear())?Pr:Ir,e.getMonth()-1)-31)+e.getDate())/7),2):0===o(r,t)?"01":"00"},"%y":function(e){return(e.j+1900).toString().substring(2)},"%Y":function(e){return e.j+1900},"%z":function(e){var t=0<=(e=e.Oa);return e=Math.abs(e)/60,(t?"+":"-")+String("0000"+(e/60*100+e%60)).slice(-4)},"%Z":function(e){return e.Ra},"%%":function(){return"%"}})0<=r.indexOf(c)&&(r=r.replace(new RegExp(c,"g"),_[c](n)));return(c=Rr(r,!1)).length>t?0:(L.set(c,e),c.length-1)}me="undefined"!=typeof dateNow?dateNow:"object"==typeof self&&self.performance&&"function"==typeof self.performance.now?function(){return self.performance.now()}:"object"==typeof performance&&"function"==typeof performance.now?function(){return performance.now()}:Date.now,mt(),Ne=Array(4096),ot(je,"/"),ut("/tmp"),ut("/home"),ut("/home/web_user"),function(){if(ut("/dev"),it(259,{read:function(){return 0},write:function(e,t,r,n){return n}}),_t("/dev/null",259),Ie(1280,Fe),Ie(1536,De),_t("/dev/tty",1280),_t("/dev/tty1",1536),"undefined"!=typeof crypto)var e=new Uint8Array(1),t=function(){return crypto.getRandomValues(e),e[0]};else t=function(){yn("random_device")};dt("random",t),dt("urandom",t),ut("/dev/shm"),ut("/dev/shm/tmp")}(),ut("/proc"),ut("/proc/self"),ut("/proc/self/fd"),ot({A:function(){var e=Qe("/proc/self","fd",16895,73);return e.c={lookup:function(e,t){var r=qe[+t];if(!r)throw new He(be.B);return(e={parent:null,A:{ta:"fake"},c:{readlink:function(){return r.path}}}).parent=e}},e}},"/proc/self/fd"),K.unshift((function(){if(!t.noFSInit&&!nt){d(!nt,"FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)"),nt=!0,mt(),t.stdin=t.stdin,t.stdout=t.stdout,t.stderr=t.stderr,t.stdin?dt("stdin",t.stdin):ct("/dev/tty","/dev/stdin"),t.stdout?dt("stdout",null,t.stdout):ct("/dev/tty","/dev/stdout"),t.stderr?dt("stderr",null,t.stderr):ct("/dev/tty1","/dev/stderr");var e=lt("/dev/stdin","r");d(0===e.fd,"invalid handle for stdin ("+e.fd+")"),d(1===(e=lt("/dev/stdout","w")).fd,"invalid handle for stdout ("+e.fd+")"),d(2===(e=lt("/dev/stderr","w")).fd,"invalid handle for stderr ("+e.fd+")")}})),J.push((function(){Ue=!1})),Q.push((function(){nt=!1;var e=t._fflush;for(e&&e(0),e=0;e<qe.length;e++){var r=qe[e];r&&pt(r)}})),K.unshift((function(){})),Q.push((function(){})),t.requestFullScreen=function(e,r,n){u("Module.requestFullScreen is deprecated. Please call Module.requestFullscreen instead."),t.requestFullScreen=t.requestFullscreen,Xt(e,r,n)},t.requestFullscreen=function(e,t,r){Yt(e,t,r)},t.requestAnimationFrame=function(e){Qt(e)},t.setCanvasSize=function(e,r,n){nr(t.canvas,e,r),n||rr()},t.pauseMainLoop=function(){St=null,Pt++},t.resumeMainLoop=function(){Pt++;var e=Ft,t=Dt,r=It;It=null,Lt(r,0,!1,Bt,!0),xt(e,t),St()},t.getUserMedia=function(){window.getUserMedia||(window.getUserMedia=navigator.getUserMedia||navigator.mozGetUserMedia),window.getUserMedia(void 0)},t.createContext=function(e,t,r,n){return Ut(e,t,r,n)},Tr="undefined"==typeof ENVIRONMENT_IS_FETCH_WORKER,function(e,t){try{var r=indexedDB.open("emscripten_filesystem",1)}catch(e){return void t()}r.onupgradeneeded=function(e){(e=e.target.result).objectStoreNames.contains("FILES")&&e.deleteObjectStore("FILES"),e.createObjectStore("FILES")},r.onsuccess=function(t){e(t.target.result)},r.onerror=function(e){t()}}((function(e){_r=e,Tr&&ce()}),(function(){_r=!1,Tr&&ce()})),"undefined"!=typeof ENVIRONMENT_IS_FETCH_WORKER&&ENVIRONMENT_IS_FETCH_WORKER||_e();for(var Dr,jr=0;256>jr;jr++);for(jr=0;32>jr;jr++)kr.push(Array(jr));function Rr(e,t){var r=Array(A(e)+1);return e=z(e,r,0,r.length),t&&(r.length=e),r}V=_(4),F=D=f(B),R=f(j=F+H),S[V>>2]=R,t.wasmTableSize=2468,t.wasmMaxTableSize=2468,t.Aa={},t.Ba={abort:yn,assert:d,enlargeMemory:W,getTotalMemory:function(){return Z},abortOnCannotGrowMemory:function(){yn("Cannot enlarge memory arrays. Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value "+Z+", (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 ")},invoke_i:function(e){var r=dn();try{return t.dynCall_i(e)}catch(e){if(mn(r),"number"!=typeof e&&"longjmp"!==e)throw e;t.setThrew(1,0)}},invoke_ii:function(e,r){var n=dn();try{return t.dynCall_ii(e,r)}catch(e){if(mn(n),"number"!=typeof e&&"longjmp"!==e)throw e;t.setThrew(1,0)}},invoke_iii:function(e,r,n){var a=dn();try{return t.dynCall_iii(e,r,n)}catch(e){if(mn(a),"number"!=typeof e&&"longjmp"!==e)throw e;t.setThrew(1,0)}},invoke_iiii:function(e,r,n,a){var i=dn();try{return t.dynCall_iiii(e,r,n,a)}catch(e){if(mn(i),"number"!=typeof e&&"longjmp"!==e)throw e;t.setThrew(1,0)}},invoke_iiiii:function(e,r,n,a,i){var o=dn();try{return t.dynCall_iiiii(e,r,n,a,i)}catch(e){if(mn(o),"number"!=typeof e&&"longjmp"!==e)throw e;t.setThrew(1,0)}},invoke_iiiiid:function(e,r,n,a,i,o){var s=dn();try{return t.dynCall_iiiiid(e,r,n,a,i,o)}catch(e){if(mn(s),"number"!=typeof e&&"longjmp"!==e)throw e;t.setThrew(1,0)}},invoke_iiiiii:function(e,r,n,a,i,o){var s=dn();try{return t.dynCall_iiiiii(e,r,n,a,i,o)}catch(e){if(mn(s),"number"!=typeof e&&"longjmp"!==e)throw e;t.setThrew(1,0)}},invoke_iiiiiid:function(e,r,n,a,i,o,s){var u=dn();try{return t.dynCall_iiiiiid(e,r,n,a,i,o,s)}catch(e){if(mn(u),"number"!=typeof e&&"longjmp"!==e)throw e;t.setThrew(1,0)}},invoke_iiiiiii:function(e,r,n,a,i,o,s){var u=dn();try{return t.dynCall_iiiiiii(e,r,n,a,i,o,s)}catch(e){if(mn(u),"number"!=typeof e&&"longjmp"!==e)throw e;t.setThrew(1,0)}},invoke_iiiiiiii:function(e,r,n,a,i,o,s,u){var _=dn();try{return t.dynCall_iiiiiiii(e,r,n,a,i,o,s,u)}catch(e){if(mn(_),"number"!=typeof e&&"longjmp"!==e)throw e;t.setThrew(1,0)}},invoke_iiiiiiiii:function(e,r,n,a,i,o,s,u,_){var c=dn();try{return t.dynCall_iiiiiiiii(e,r,n,a,i,o,s,u,_)}catch(e){if(mn(c),"number"!=typeof e&&"longjmp"!==e)throw e;t.setThrew(1,0)}},invoke_iiiiij:function(e,r,n,a,i,o,s){var u=dn();try{return t.dynCall_iiiiij(e,r,n,a,i,o,s)}catch(e){if(mn(u),"number"!=typeof e&&"longjmp"!==e)throw e;t.setThrew(1,0)}},invoke_iiji:function(e,r,n,a,i){var o=dn();try{return t.dynCall_iiji(e,r,n,a,i)}catch(e){if(mn(o),"number"!=typeof e&&"longjmp"!==e)throw e;t.setThrew(1,0)}},invoke_v:function(e){var r=dn();try{t.dynCall_v(e)}catch(e){if(mn(r),"number"!=typeof e&&"longjmp"!==e)throw e;t.setThrew(1,0)}},invoke_vi:function(e,r){var n=dn();try{t.dynCall_vi(e,r)}catch(e){if(mn(n),"number"!=typeof e&&"longjmp"!==e)throw e;t.setThrew(1,0)}},invoke_vii:function(e,r,n){var a=dn();try{t.dynCall_vii(e,r,n)}catch(e){if(mn(a),"number"!=typeof e&&"longjmp"!==e)throw e;t.setThrew(1,0)}},invoke_viiffii:function(e,r,n,a,i,o,s){var u=dn();try{t.dynCall_viiffii(e,r,n,a,i,o,s)}catch(e){if(mn(u),"number"!=typeof e&&"longjmp"!==e)throw e;t.setThrew(1,0)}},invoke_viii:function(e,r,n,a){var i=dn();try{t.dynCall_viii(e,r,n,a)}catch(e){if(mn(i),"number"!=typeof e&&"longjmp"!==e)throw e;t.setThrew(1,0)}},invoke_viiifffii:function(e,r,n,a,i,o,s,u,_){var c=dn();try{t.dynCall_viiifffii(e,r,n,a,i,o,s,u,_)}catch(e){if(mn(c),"number"!=typeof e&&"longjmp"!==e)throw e;t.setThrew(1,0)}},invoke_viiiffii:function(e,r,n,a,i,o,s,u){var _=dn();try{t.dynCall_viiiffii(e,r,n,a,i,o,s,u)}catch(e){if(mn(_),"number"!=typeof e&&"longjmp"!==e)throw e;t.setThrew(1,0)}},invoke_viiii:function(e,r,n,a,i){var o=dn();try{t.dynCall_viiii(e,r,n,a,i)}catch(e){if(mn(o),"number"!=typeof e&&"longjmp"!==e)throw e;t.setThrew(1,0)}},invoke_viiiii:function(e,r,n,a,i,o){var s=dn();try{t.dynCall_viiiii(e,r,n,a,i,o)}catch(e){if(mn(s),"number"!=typeof e&&"longjmp"!==e)throw e;t.setThrew(1,0)}},invoke_viiiiiffffffffffffffff:function(e,r,n,a,i,o,s,u,_,c,f,l,p,h,m,d,b,y,v,g,w,M){var k=dn();try{t.dynCall_viiiiiffffffffffffffff(e,r,n,a,i,o,s,u,_,c,f,l,p,h,m,d,b,y,v,g,w,M)}catch(e){if(mn(k),"number"!=typeof e&&"longjmp"!==e)throw e;t.setThrew(1,0)}},invoke_viiiiii:function(e,r,n,a,i,o,s){var u=dn();try{t.dynCall_viiiiii(e,r,n,a,i,o,s)}catch(e){if(mn(u),"number"!=typeof e&&"longjmp"!==e)throw e;t.setThrew(1,0)}},invoke_viijii:function(e,r,n,a,i,o,s){var u=dn();try{t.dynCall_viijii(e,r,n,a,i,o,s)}catch(e){if(mn(u),"number"!=typeof e&&"longjmp"!==e)throw e;t.setThrew(1,0)}},invoke_vij:function(e,r,n,a){var i=dn();try{t.dynCall_vij(e,r,n,a)}catch(e){if(mn(i),"number"!=typeof e&&"longjmp"!==e)throw e;t.setThrew(1,0)}},invoke_viji:function(e,r,n,a,i){var o=dn();try{t.dynCall_viji(e,r,n,a,i)}catch(e){if(mn(o),"number"!=typeof e&&"longjmp"!==e)throw e;t.setThrew(1,0)}},invoke_vijii:function(e,r,n,a,i,o){var s=dn();try{t.dynCall_vijii(e,r,n,a,i,o)}catch(e){if(mn(s),"number"!=typeof e&&"longjmp"!==e)throw e;t.setThrew(1,0)}},___buildEnvironment:function e(r){if(e.Da)var n=S[r>>2],a=S[n>>2];else e.Da=!0,he.USER=he.LOGNAME="web_user",he.PATH="/",he.PWD="/",he.HOME="/home/web_user",he.LANG="C.UTF-8",he._=t.thisProgram,a=ee?ln(1024):c(1024),n=ee?ln(256):c(256),S[n>>2]=a,S[r>>2]=n;r=[];var i,o=0;for(i in he)if("string"==typeof he[i]){var s=i+"="+he[i];r.push(s),o+=s.length}if(1024<o)throw Error("Environment size exceeded TOTAL_ENV_SIZE!");for(i=0;i<r.length;i++){o=s=r[i];for(var u=a,_=0;_<o.length;++_)L[u++>>0]=o.charCodeAt(_);L[u>>0]=0,S[n+4*i>>2]=a,a+=s.length+1}S[n+4*r.length>>2]=0},___clock_gettime:function(){return ve.apply(null,arguments)},___cxa_allocate_exception:function(e){return ln(e)},___cxa_begin_catch:function(e){var t=Me[e];return t&&!t.ma&&(t.ma=!0,un.$--),t&&(t.L=!1),we.push(e),(t=ke(e))&&Me[t].J++,e},___cxa_current_primary_exception:function(){var e=we[we.length-1]||0;if(e){var t=ke(e);t&&Me[t].J++}return e},___cxa_decrement_exception_refcount:function(e){ze(ke(e))},___cxa_end_catch:function(){t.setThrew(0);var e=we.pop();e&&(ze(ke(e)),ge=0)},___cxa_find_matching_catch:function e(){var r=ge;if(!r)return 0|(pn(0),0);var n=Me[r],a=n.type;if(!a)return 0|(pn(0),r);var i=Array.prototype.slice.call(arguments);t.___cxa_is_pointer_type(a),e.buffer||(e.buffer=ln(4)),S[e.buffer>>2]=r,r=e.buffer;for(var o=0;o<i.length;o++)if(i[o]&&t.___cxa_can_catch(i[o],a,r))return r=S[r>>2],n.ka=r,0|(pn(i[o]),r);return r=S[r>>2],0|(pn(a),r)},___cxa_free_exception:Ae,___cxa_increment_exception_refcount:function(e){(e=ke(e))&&Me[e].J++},___cxa_pure_virtual:function(){throw m=!0,"Pure virtual function called!"},___cxa_rethrow:xe,___cxa_rethrow_primary_exception:function(e){e&&(we.push(e),Me[e].L=!0,xe())},___cxa_throw:function(e,t,r){throw Me[e]={Ka:e,ka:e,type:t,oa:r,J:0,ma:!1,L:!1},ge=e,"uncaught_exception"in un?un.$++:un.$=1,e+" - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch."},___cxa_uncaught_exception:function(){return!!un.$},___gxx_personality_v0:function(){},___lock:function(){},___map_file:function(){return ye(be.I),-1},___resumeException:function(e){throw ge||(ge=e),e+" - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch."},___setErrNo:ye,___syscall140:function(e,t){kt=t;try{var r=At();zt();var n=zt(),a=zt(),i=zt();return ht(r,n,i),S[a>>2]=r.position,r.ba&&0===n&&0===i&&(r.ba=null),0}catch(e){return void 0!==wt&&e instanceof He||yn(e),-e.v}},___syscall145:function(e,t){kt=t;try{var r=At(),n=zt();e:{var a=zt();for(t=e=0;t<a;t++){var i=S[n+(8*t+4)>>2],o=r,s=S[n+8*t>>2],u=i,_=void 0,c=L;if(0>u||0>_)throw new He(be.i);if(null===o.fd)throw new He(be.B);if(1==(2097155&o.flags))throw new He(be.B);if(16384==(61440&o.node.mode))throw new He(be.N);if(!o.f.read)throw new He(be.i);var f=void 0!==_;if(f){if(!o.seekable)throw new He(be.O)}else _=o.position;var l=o.f.read(o,c,s,u,_);f||(o.position+=l);var p=l;if(0>p){var h=-1;break e}if(e+=p,p<i)break}h=e}return h}catch(e){return void 0!==wt&&e instanceof He||yn(e),-e.v}},___syscall146:function(e,t){kt=t;try{var r=At(),n=zt();e:{var a=zt();for(t=e=0;t<a;t++){var i=r,o=S[n+8*t>>2],s=S[n+(8*t+4)>>2],u=L,_=void 0;if(0>s||0>_)throw new He(be.i);if(null===i.fd)throw new He(be.B);if(0==(2097155&i.flags))throw new He(be.B);if(16384==(61440&i.node.mode))throw new He(be.N);if(!i.f.write)throw new He(be.i);1024&i.flags&&ht(i,0,2);var c=void 0!==_;if(c){if(!i.seekable)throw new He(be.O)}else _=i.position;var f=i.f.write(i,u,o,s,_,void 0);c||(i.position+=f);try{i.path&&We.onWriteToFile&&We.onWriteToFile(i.path)}catch(e){console.log("FS.trackingDelegate[\'onWriteToFile\'](\'"+path+"\') threw an exception: "+e.message)}var l=f;if(0>l){var p=-1;break e}e+=l}p=e}return p}catch(e){return void 0!==wt&&e instanceof He||yn(e),-e.v}},___syscall196:function(e,t){kt=t;try{var r=g(zt());e:{var n=zt();try{var a=Ye(r,{aa:!1}).node;if(!a)throw new He(be.u);if(!a.c.m)throw new He(be.I);var i=a.c.m(a)}catch(e){if(e&&e.node&&Ce(r)!==Ce(Xe(e.node))){var o=-be.Z;break e}throw e}S[n>>2]=i.dev,S[n+4>>2]=0,S[n+8>>2]=i.ino,S[n+12>>2]=i.mode,S[n+16>>2]=i.nlink,S[n+20>>2]=i.uid,S[n+24>>2]=i.gid,S[n+28>>2]=i.rdev,S[n+32>>2]=0,S[n+36>>2]=i.size,S[n+40>>2]=4096,S[n+44>>2]=i.blocks,S[n+48>>2]=i.atime.getTime()/1e3|0,S[n+52>>2]=0,S[n+56>>2]=i.mtime.getTime()/1e3|0,S[n+60>>2]=0,S[n+64>>2]=i.ctime.getTime()/1e3|0,S[n+68>>2]=0,S[n+72>>2]=i.ino,o=0}return o}catch(e){return void 0!==wt&&e instanceof He||yn(e),-e.v}},___syscall221:function(e,t){kt=t;try{var r=At();switch(zt()){case 0:var n=zt();return 0>n?-be.i:lt(r.path,r.flags,0,n).fd;case 1:case 2:return 0;case 3:return r.flags;case 4:return n=zt(),r.flags|=n,0;case 12:case 12:return n=zt(),C[n+0>>1]=2,0;case 13:case 14:case 13:case 14:return 0;case 16:case 8:return-be.i;case 9:return ye(be.i),-1;default:return-be.i}}catch(e){return void 0!==wt&&e instanceof He||yn(e),-e.v}},___syscall5:function(e,t){kt=t;try{return lt(g(zt()),zt(),zt()).fd}catch(e){return void 0!==wt&&e instanceof He||yn(e),-e.v}},___syscall54:function(e,t){kt=t;try{var r=At(),n=zt();switch(n){case 21509:case 21505:return r.tty?0:-be.D;case 21510:case 21511:case 21512:case 21506:case 21507:case 21508:return r.tty?0:-be.D;case 21519:if(!r.tty)return-be.D;var a=zt();return S[a>>2]=0;case 21520:return r.tty?-be.i:-be.D;case 21531:if(e=a=zt(),!r.f.Ha)throw new He(be.D);return r.f.Ha(r,n,e);case 21523:case 21524:return r.tty?0:-be.D;default:yn("bad ioctl syscall "+n)}}catch(e){return void 0!==wt&&e instanceof He||yn(e),-e.v}},___syscall6:function(e,t){kt=t;try{return pt(At()),0}catch(e){return void 0!==wt&&e instanceof He||yn(e),-e.v}},___syscall91:function(e,t){kt=t;try{var r=zt(),n=zt(),a=Mt[r];if(!a)return 0;if(n===a.Xc){var i=qe[a.fd],o=a.flags,s=new Uint8Array(E.subarray(r,r+n));i&&i.f.T&&i.f.T(i,s,0,n,o),Mt[r]=null,a.za&&fn(a.Yc)}return 0}catch(e){return void 0!==wt&&e instanceof He||yn(e),-e.v}},___unlock:function(){},__addDays:Br,__arraySum:Sr,__emscripten_fetch_cache_data:lr,__emscripten_fetch_delete_cached_data:hr,__emscripten_fetch_load_cached_data:pr,__emscripten_fetch_xhr:fr,__emscripten_get_fetch_work_queue:function(){return mr},__isLeapYear:Or,_abort:function(){t.abort()},_clock_gettime:ve,_emidentity:function(){var e=new URL(location.origin).hostname;if(0===e.length&&(e=new URL(location.href.replace("blob:","")).hostname),/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(e))0===e.indexOf("10.")&&(e="10.*"),0===e.indexOf("192.168.")&&(e="192.168.*"),0===e.indexOf("127.")&&(e="127.*");else{var t=new RegExp("("+String.fromCharCode(92)+".ngrok"+String.fromCharCode(92)+".io)$","i");t.test(e)&&(e="*.ngrok.io"),(t=new RegExp("("+String.fromCharCode(92)+".arweb"+String.fromCharCode(92)+".app)$","i")).test(e)&&(e="*.arweb.app")}t=A(e)+1;var r=ln(t);return z(e,E,r,t+1),r},_emlicerr:function(){self.postMessage({t:"licerr"})},_emscripten_asm_const_i:function(e){return le[e]()},_emscripten_async_call:function(e,r,n){function a(){!function(e){if(e){d("vi"),h.vi||(h.vi={});var r=h.vi;return r[e]||(r[e]=function(r){return function(e,r,n){return n&&n.length?t["dynCall_"+e].apply(null,[r].concat(n)):t["dynCall_"+e].call(null,r)}("vi",e,[r])}),r[e]}}(e)(r)}t.noExitRuntime=!0,0<=n?$t(a,n):function(e){Qt((function(){m||e()}))}(a)},_emscripten_get_now:me,_emscripten_get_now_is_monotonic:de,_emscripten_is_main_browser_thread:function(){return!1},_emscripten_is_main_runtime_thread:function(){return 1},_emscripten_memcpy_big:function(e,t,r){return E.set(E.subarray(t,t+r),e),e},_emscripten_set_main_loop:Lt,_emscripten_set_main_loop_timing:xt,_emscripten_start_fetch:function(e,r,n,a){function i(e){l?t.dynCall_vi(l,e):n&&n(e)}function o(e){p?t.dynCall_vi(p,e):a&&a(e)}function s(e,n){lr(_r,e,n.response,(function(e){f?t.dynCall_vi(f,e):r&&r(e)}),(function(e){f?t.dynCall_vi(f,e):r&&r(e)}))}function u(e){f?t.dynCall_vi(f,e):r&&r(e)}void 0!==t&&(t.noExitRuntime=!0);var _=e+112,c=g(_),f=T[_+36>>2],l=T[_+40>>2],p=T[_+44>>2],h=T[_+48>>2],m=!!(4&h),d=!!(32&h);if(16&h&&"EM_IDB_STORE"!==c&&"EM_IDB_DELETE"!==c){if(d)return 0;fr(e,m?s:u,i,o)}else{if(!_r)return i(e),0;"EM_IDB_STORE"===c?(c=T[_+80>>2],_=E.slice(c,c+T[_+84>>2]),lr(_r,e,_,u,i)):"EM_IDB_DELETE"===c?hr(_r,e,u,i):pr(_r,e,u,d?i:m?function(e){fr(e,s,i,o)}:function(e){fr(e,u,i,o)})}return e},_getenv:function e(t){if(0===t)return 0;if(t=g(t),!he.hasOwnProperty(t))return 0;e.l&&fn(e.l);var r=A(t=he[t])+1,n=ln(r);return n&&z(t,L,n,r),e.l=n},_gettimeofday:function(e){var t=Date.now();return S[e>>2]=t/1e3|0,S[e+4>>2]=t%1e3*1e3|0,0},_glBindTexture:function(e,t){Dr.bindTexture(e,t?gr[t]:null)},_glGenTextures:function(e,t){for(var r=0;r<e;r++){var n=Dr.createTexture();if(!n){for(vr||(vr=1282);r<e;)S[t+4*r++>>2]=0;break}var a=zr(gr);n.name=a,gr[a]=n,S[t+4*r>>2]=a}},_glTexImage2D:function(e,t,r,n,a,i,o,s,u){var _=null;u&&(_=xr(s,o,n,a,u)),Dr.texImage2D(e,t,r,n,a,i,o,s,_)},_glTexParameteri:function(e,t,r){Dr.texParameteri(e,t,r)},_llvm_exp2_f32:function(e){return Math.pow(2,e)},_llvm_stackrestore:function(e){var t=Lr.l[e];Lr.l.splice(e,1),mn(t)},_llvm_stacksave:Lr,_llvm_trap:function(){yn("trap!")},_pthread_cond_destroy:function(){return 0},_pthread_cond_init:function(){return 0},_pthread_cond_signal:function(){return 0},_pthread_cond_wait:function(){return 0},_pthread_create:function(){return 11},_pthread_getspecific:function(e){return Er[e]||0},_pthread_join:function(){},_pthread_key_create:function(e){return 0==e?be.i:(S[e>>2]=Cr,Er[Cr]=0,Cr++,0)},_pthread_mutex_destroy:function(){},_pthread_mutex_init:function(){},_pthread_once:function e(r,n){e.l||(e.l={}),r in e.l||(t.dynCall_v(n),e.l[r]=1)},_pthread_setspecific:function(e,t){return e in Er?(Er[e]=t,0):be.i},_strftime:Fr,_strftime_l:function(e,t,r,n){return Fr(e,t,r,n)},_sysconf:function(e){switch(e){case 30:return 16384;case 85:return 131068;case 132:case 133:case 12:case 137:case 138:case 15:case 235:case 16:case 17:case 18:case 19:case 20:case 149:case 13:case 10:case 236:case 153:case 9:case 21:case 22:case 159:case 154:case 14:case 77:case 78:case 139:case 80:case 81:case 82:case 68:case 67:case 164:case 11:case 29:case 47:case 48:case 95:case 52:case 51:case 46:return 200809;case 79:return 0;case 27:case 246:case 127:case 128:case 23:case 24:case 160:case 161:case 181:case 182:case 242:case 183:case 184:case 243:case 244:case 245:case 165:case 178:case 179:case 49:case 50:case 168:case 169:case 175:case 170:case 171:case 172:case 97:case 76:case 32:case 173:case 35:return-1;case 176:case 177:case 7:case 155:case 8:case 157:case 125:case 126:case 92:case 93:case 129:case 130:case 131:case 94:case 91:return 1;case 74:case 60:case 69:case 70:case 4:return 1024;case 31:case 42:case 72:return 32;case 87:case 26:case 33:return 2147483647;case 34:case 1:return 47839;case 38:case 36:return 99;case 43:case 37:return 2048;case 0:return 2097152;case 3:return 65536;case 28:return 32768;case 44:return 32767;case 75:return 16384;case 39:return 1e3;case 89:return 700;case 71:return 256;case 40:return 255;case 2:return 100;case 180:return 64;case 25:return 20;case 5:return 16;case 6:return 6;case 73:return 4;case 84:return"object"==typeof navigator&&navigator.hardwareConcurrency||1}return ye(be.i),-1},emscriptenWebGLComputeImageSize:Ar,emscriptenWebGLGetTexPixelData:xr,DYNAMICTOP_PTR:V,tempDoublePtr:pe,STACKTOP:D,STACK_MAX:j};var Vr=t.asm(t.Aa,t.Ba,x);t.asm=Vr;var qr=t.__GLOBAL__I_000101=function(){return t.asm.__GLOBAL__I_000101.apply(null,arguments)},Gr=t.__GLOBAL__sub_I_AZHighLevelEncoder_cpp=function(){return t.asm.__GLOBAL__sub_I_AZHighLevelEncoder_cpp.apply(null,arguments)},Nr=t.__GLOBAL__sub_I_CameraSource_cpp=function(){return t.asm.__GLOBAL__sub_I_CameraSource_cpp.apply(null,arguments)},Ur=t.__GLOBAL__sub_I_CharacterSetECI_cpp=function(){return t.asm.__GLOBAL__sub_I_CharacterSetECI_cpp.apply(null,arguments)},Wr=t.__GLOBAL__sub_I_DMECEncoder_cpp=function(){return t.asm.__GLOBAL__sub_I_DMECEncoder_cpp.apply(null,arguments)},Hr=t.__GLOBAL__sub_I_DMHighLevelEncoder_cpp=function(){return t.asm.__GLOBAL__sub_I_DMHighLevelEncoder_cpp.apply(null,arguments)},Zr=t.__GLOBAL__sub_I_GridSampler_cpp=function(){return t.asm.__GLOBAL__sub_I_GridSampler_cpp.apply(null,arguments)},Yr=t.__GLOBAL__sub_I_ODCode128Patterns_cpp=function(){return t.asm.__GLOBAL__sub_I_ODCode128Patterns_cpp.apply(null,arguments)},Xr=t.__GLOBAL__sub_I_ODRSSExpandedReader_cpp=function(){return t.asm.__GLOBAL__sub_I_ODRSSExpandedReader_cpp.apply(null,arguments)},Kr=t.__GLOBAL__sub_I_PDFDetector_cpp=function(){return t.asm.__GLOBAL__sub_I_PDFDetector_cpp.apply(null,arguments)},Jr=t.__GLOBAL__sub_I_StandardStatsManager_cpp=function(){return t.asm.__GLOBAL__sub_I_StandardStatsManager_cpp.apply(null,arguments)},Qr=t.__GLOBAL__sub_I_barcode_finder_cpp=function(){return t.asm.__GLOBAL__sub_I_barcode_finder_cpp.apply(null,arguments)},$r=t.__GLOBAL__sub_I_face_landmark_cpp=function(){return t.asm.__GLOBAL__sub_I_face_landmark_cpp.apply(null,arguments)},en=t.__GLOBAL__sub_I_face_mesh_cpp=function(){return t.asm.__GLOBAL__sub_I_face_mesh_cpp.apply(null,arguments)},tn=t.__GLOBAL__sub_I_face_tracker_cpp=function(){return t.asm.__GLOBAL__sub_I_face_tracker_cpp.apply(null,arguments)},rn=t.__GLOBAL__sub_I_image_tracker_cpp=function(){return t.asm.__GLOBAL__sub_I_image_tracker_cpp.apply(null,arguments)},nn=t.__GLOBAL__sub_I_instant_tracker_cpp=function(){return t.asm.__GLOBAL__sub_I_instant_tracker_cpp.apply(null,arguments)},an=t.__GLOBAL__sub_I_iostream_cpp=function(){return t.asm.__GLOBAL__sub_I_iostream_cpp.apply(null,arguments)},on=t.__GLOBAL__sub_I_pipeline_cpp=function(){return t.asm.__GLOBAL__sub_I_pipeline_cpp.apply(null,arguments)},sn=t.__GLOBAL__sub_I_zappar_face_tracker_cpp=function(){return t.asm.__GLOBAL__sub_I_zappar_face_tracker_cpp.apply(null,arguments)};t.__Z20zappar_face_mesh_uvsP19zappar_face_mesh_ti=function(){return t.asm.__Z20zappar_face_mesh_uvsP19zappar_face_mesh_ti.apply(null,arguments)},t.__Z23zappar_face_mesh_updateP19zappar_face_mesh_tiPKfS2_i=function(){return t.asm.__Z23zappar_face_mesh_updateP19zappar_face_mesh_tiPKfS2_i.apply(null,arguments)},t.__Z24zappar_face_mesh_indicesP19zappar_face_mesh_ti=function(){return t.asm.__Z24zappar_face_mesh_indicesP19zappar_face_mesh_ti.apply(null,arguments)},t.__Z24zappar_face_mesh_normalsP19zappar_face_mesh_ti=function(){return t.asm.__Z24zappar_face_mesh_normalsP19zappar_face_mesh_ti.apply(null,arguments)},t.__Z25zappar_face_mesh_uvs_sizeP19zappar_face_mesh_ti=function(){return t.asm.__Z25zappar_face_mesh_uvs_sizeP19zappar_face_mesh_ti.apply(null,arguments)},t.__Z25zappar_face_mesh_verticesP19zappar_face_mesh_ti=function(){return t.asm.__Z25zappar_face_mesh_verticesP19zappar_face_mesh_ti.apply(null,arguments)},t.__Z27zappar_face_landmark_updateP23zappar_face_landmark_tiPKfS2_i=function(){return t.asm.__Z27zappar_face_landmark_updateP23zappar_face_landmark_tiPKfS2_i.apply(null,arguments)},t.__Z29zappar_face_mesh_indices_sizeP19zappar_face_mesh_ti=function(){return t.asm.__Z29zappar_face_mesh_indices_sizeP19zappar_face_mesh_ti.apply(null,arguments)},t.__Z29zappar_face_mesh_normals_sizeP19zappar_face_mesh_ti=function(){return t.asm.__Z29zappar_face_mesh_normals_sizeP19zappar_face_mesh_ti.apply(null,arguments)},t.__Z30zappar_face_mesh_vertices_sizeP19zappar_face_mesh_ti=function(){return t.asm.__Z30zappar_face_mesh_vertices_sizeP19zappar_face_mesh_ti.apply(null,arguments)},t.__Z31zappar_face_mesh_loaded_versionP19zappar_face_mesh_ti=function(){return t.asm.__Z31zappar_face_mesh_loaded_versionP19zappar_face_mesh_ti.apply(null,arguments)},t.__Z33zappar_face_mesh_load_from_memoryP19zappar_face_mesh_tiPKciiiii=function(){return t.asm.__Z33zappar_face_mesh_load_from_memoryP19zappar_face_mesh_tiPKciiiii.apply(null,arguments)},t.__Z40zappar_image_tracker_target_preview_rgbaP23zappar_image_tracker_tii=function(){return t.asm.__Z40zappar_image_tracker_target_preview_rgbaP23zappar_image_tracker_tii.apply(null,arguments)},t.__Z42zappar_image_tracker_target_load_from_fileP23zappar_image_tracker_tiPKc=function(){return t.asm.__Z42zappar_image_tracker_target_load_from_fileP23zappar_image_tracker_tiPKc.apply(null,arguments)},t.__Z45zappar_image_tracker_target_preview_rgba_sizeP23zappar_image_tracker_tii=function(){return t.asm.__Z45zappar_image_tracker_target_preview_rgba_sizeP23zappar_image_tracker_tii.apply(null,arguments)},t.__Z46zappar_image_tracker_target_preview_compressedP23zappar_image_tracker_tii=function(){return t.asm.__Z46zappar_image_tracker_target_preview_compressedP23zappar_image_tracker_tii.apply(null,arguments)},t.__Z46zappar_image_tracker_target_preview_rgba_widthP23zappar_image_tracker_tii=function(){return t.asm.__Z46zappar_image_tracker_target_preview_rgba_widthP23zappar_image_tracker_tii.apply(null,arguments)},t.__Z47zappar_image_tracker_target_preview_rgba_heightP23zappar_image_tracker_tii=function(){return t.asm.__Z47zappar_image_tracker_target_preview_rgba_heightP23zappar_image_tracker_tii.apply(null,arguments)},t.__Z51zappar_image_tracker_target_preview_compressed_sizeP23zappar_image_tracker_tii=function(){return t.asm.__Z51zappar_image_tracker_target_preview_compressed_sizeP23zappar_image_tracker_tii.apply(null,arguments)},t.__Z55zappar_image_tracker_target_preview_compressed_mimetypeP23zappar_image_tracker_tii=function(){return t.asm.__Z55zappar_image_tracker_target_preview_compressed_mimetypeP23zappar_image_tracker_tii.apply(null,arguments)};var un=t.__ZSt18uncaught_exceptionv=function(){return t.asm.__ZSt18uncaught_exceptionv.apply(null,arguments)};t.___cxa_can_catch=function(){return t.asm.___cxa_can_catch.apply(null,arguments)},t.___cxa_is_pointer_type=function(){return t.asm.___cxa_is_pointer_type.apply(null,arguments)},t.___em_js__emidentity=function(){return t.asm.___em_js__emidentity.apply(null,arguments)},t.___em_js__emlicerr=function(){return t.asm.___em_js__emlicerr.apply(null,arguments)};var _n=t.___emscripten_environ_constructor=function(){return t.asm.___emscripten_environ_constructor.apply(null,arguments)};t.___errno_location=function(){return t.asm.___errno_location.apply(null,arguments)},t.__get_environ=function(){return t.asm.__get_environ.apply(null,arguments)};var cn=t._emscripten_replace_memory=function(){return t.asm._emscripten_replace_memory.apply(null,arguments)},fn=t._free=function(){return t.asm._free.apply(null,arguments)};t._llvm_bswap_i32=function(){return t.asm._llvm_bswap_i32.apply(null,arguments)},t._llvm_round_f32=function(){return t.asm._llvm_round_f32.apply(null,arguments)},t._llvm_round_f64=function(){return t.asm._llvm_round_f64.apply(null,arguments)};var ln=t._malloc=function(){return t.asm._malloc.apply(null,arguments)};t._memcpy=function(){return t.asm._memcpy.apply(null,arguments)},t._memmove=function(){return t.asm._memmove.apply(null,arguments)},t._memset=function(){return t.asm._memset.apply(null,arguments)},t._pthread_cond_broadcast=function(){return t.asm._pthread_cond_broadcast.apply(null,arguments)},t._pthread_mutex_lock=function(){return t.asm._pthread_mutex_lock.apply(null,arguments)},t._pthread_mutex_unlock=function(){return t.asm._pthread_mutex_unlock.apply(null,arguments)},t._round=function(){return t.asm._round.apply(null,arguments)},t._sbrk=function(){return t.asm._sbrk.apply(null,arguments)},t._zappar_analytics_project_id_set=function(){return t.asm._zappar_analytics_project_id_set.apply(null,arguments)},t._zappar_barcode_finder_create=function(){return t.asm._zappar_barcode_finder_create.apply(null,arguments)},t._zappar_barcode_finder_destroy=function(){return t.asm._zappar_barcode_finder_destroy.apply(null,arguments)},t._zappar_barcode_finder_enabled=function(){return t.asm._zappar_barcode_finder_enabled.apply(null,arguments)},t._zappar_barcode_finder_enabled_set=function(){return t.asm._zappar_barcode_finder_enabled_set.apply(null,arguments)},t._zappar_barcode_finder_formats=function(){return t.asm._zappar_barcode_finder_formats.apply(null,arguments)},t._zappar_barcode_finder_formats_set=function(){return t.asm._zappar_barcode_finder_formats_set.apply(null,arguments)},t._zappar_barcode_finder_found_format=function(){return t.asm._zappar_barcode_finder_found_format.apply(null,arguments)},t._zappar_barcode_finder_found_number=function(){return t.asm._zappar_barcode_finder_found_number.apply(null,arguments)},t._zappar_barcode_finder_found_text=function(){return t.asm._zappar_barcode_finder_found_text.apply(null,arguments)},t._zappar_camera_default_device_id=function(){return t.asm._zappar_camera_default_device_id.apply(null,arguments)},t._zappar_camera_source_create=function(){return t.asm._zappar_camera_source_create.apply(null,arguments)},t._zappar_camera_source_destroy=function(){return t.asm._zappar_camera_source_destroy.apply(null,arguments)},t._zappar_camera_source_pause=function(){return t.asm._zappar_camera_source_pause.apply(null,arguments)},t._zappar_camera_source_start=function(){return t.asm._zappar_camera_source_start.apply(null,arguments)},t._zappar_face_landmark_anchor_pose=function(){return t.asm._zappar_face_landmark_anchor_pose.apply(null,arguments)},t._zappar_face_landmark_create=function(){return t.asm._zappar_face_landmark_create.apply(null,arguments)},t._zappar_face_landmark_destroy=function(){return t.asm._zappar_face_landmark_destroy.apply(null,arguments)},t._zappar_face_mesh_create=function(){return t.asm._zappar_face_mesh_create.apply(null,arguments)},t._zappar_face_mesh_destroy=function(){return t.asm._zappar_face_mesh_destroy.apply(null,arguments)},t._zappar_face_tracker_anchor_count=function(){return t.asm._zappar_face_tracker_anchor_count.apply(null,arguments)},t._zappar_face_tracker_anchor_expression_coefficients=function(){return t.asm._zappar_face_tracker_anchor_expression_coefficients.apply(null,arguments)},t._zappar_face_tracker_anchor_id=function(){return t.asm._zappar_face_tracker_anchor_id.apply(null,arguments)},t._zappar_face_tracker_anchor_identity_coefficients=function(){return t.asm._zappar_face_tracker_anchor_identity_coefficients.apply(null,arguments)},t._zappar_face_tracker_anchor_pose_raw=function(){return t.asm._zappar_face_tracker_anchor_pose_raw.apply(null,arguments)},t._zappar_face_tracker_create=function(){return t.asm._zappar_face_tracker_create.apply(null,arguments)},t._zappar_face_tracker_destroy=function(){return t.asm._zappar_face_tracker_destroy.apply(null,arguments)},t._zappar_face_tracker_enabled=function(){return t.asm._zappar_face_tracker_enabled.apply(null,arguments)},t._zappar_face_tracker_enabled_set=function(){return t.asm._zappar_face_tracker_enabled_set.apply(null,arguments)},t._zappar_face_tracker_max_faces=function(){return t.asm._zappar_face_tracker_max_faces.apply(null,arguments)},t._zappar_face_tracker_max_faces_set=function(){return t.asm._zappar_face_tracker_max_faces_set.apply(null,arguments)},t._zappar_face_tracker_model_load_from_memory=function(){return t.asm._zappar_face_tracker_model_load_from_memory.apply(null,arguments)},t._zappar_face_tracker_model_loaded_version=function(){return t.asm._zappar_face_tracker_model_loaded_version.apply(null,arguments)},t._zappar_has_initialized=function(){return t.asm._zappar_has_initialized.apply(null,arguments)},t._zappar_image_tracker_anchor_count=function(){return t.asm._zappar_image_tracker_anchor_count.apply(null,arguments)},t._zappar_image_tracker_anchor_id=function(){return t.asm._zappar_image_tracker_anchor_id.apply(null,arguments)},t._zappar_image_tracker_anchor_pose_raw=function(){return t.asm._zappar_image_tracker_anchor_pose_raw.apply(null,arguments)},t._zappar_image_tracker_create=function(){return t.asm._zappar_image_tracker_create.apply(null,arguments)},t._zappar_image_tracker_destroy=function(){return t.asm._zappar_image_tracker_destroy.apply(null,arguments)},t._zappar_image_tracker_enabled=function(){return t.asm._zappar_image_tracker_enabled.apply(null,arguments)},t._zappar_image_tracker_enabled_set=function(){return t.asm._zappar_image_tracker_enabled_set.apply(null,arguments)},t._zappar_image_tracker_target_count=function(){return t.asm._zappar_image_tracker_target_count.apply(null,arguments)},t._zappar_image_tracker_target_load_from_memory=function(){return t.asm._zappar_image_tracker_target_load_from_memory.apply(null,arguments)},t._zappar_image_tracker_target_loaded_version=function(){return t.asm._zappar_image_tracker_target_loaded_version.apply(null,arguments)},t._zappar_instant_world_tracker_anchor_pose_raw=function(){return t.asm._zappar_instant_world_tracker_anchor_pose_raw.apply(null,arguments)},t._zappar_instant_world_tracker_anchor_pose_set_from_camera_offset=function(){return t.asm._zappar_instant_world_tracker_anchor_pose_set_from_camera_offset.apply(null,arguments)},t._zappar_instant_world_tracker_create=function(){return t.asm._zappar_instant_world_tracker_create.apply(null,arguments)},t._zappar_instant_world_tracker_destroy=function(){return t.asm._zappar_instant_world_tracker_destroy.apply(null,arguments)},t._zappar_instant_world_tracker_enabled=function(){return t.asm._zappar_instant_world_tracker_enabled.apply(null,arguments)},t._zappar_instant_world_tracker_enabled_set=function(){return t.asm._zappar_instant_world_tracker_enabled_set.apply(null,arguments)},t._zappar_invert=function(){return t.asm._zappar_invert.apply(null,arguments)},t._zappar_log_level=function(){return t.asm._zappar_log_level.apply(null,arguments)},t._zappar_log_level_set=function(){return t.asm._zappar_log_level_set.apply(null,arguments)},t._zappar_pipeline_camera_frame_camera_attitude=function(){return t.asm._zappar_pipeline_camera_frame_camera_attitude.apply(null,arguments)},t._zappar_pipeline_camera_frame_submit=function(){return t.asm._zappar_pipeline_camera_frame_submit.apply(null,arguments)},t._zappar_pipeline_camera_frame_texture_gl=function(){return t.asm._zappar_pipeline_camera_frame_texture_gl.apply(null,arguments)},t._zappar_pipeline_camera_frame_texture_matrix=function(){return t.asm._zappar_pipeline_camera_frame_texture_matrix.apply(null,arguments)},t._zappar_pipeline_camera_frame_upload_gl=function(){return t.asm._zappar_pipeline_camera_frame_upload_gl.apply(null,arguments)},t._zappar_pipeline_camera_frame_user_data=function(){return t.asm._zappar_pipeline_camera_frame_user_data.apply(null,arguments)},t._zappar_pipeline_camera_frame_user_facing=function(){return t.asm._zappar_pipeline_camera_frame_user_facing.apply(null,arguments)},t._zappar_pipeline_camera_model=function(){return t.asm._zappar_pipeline_camera_model.apply(null,arguments)},t._zappar_pipeline_camera_pose_default=function(){return t.asm._zappar_pipeline_camera_pose_default.apply(null,arguments)},t._zappar_pipeline_camera_pose_with_attitude=function(){return t.asm._zappar_pipeline_camera_pose_with_attitude.apply(null,arguments)},t._zappar_pipeline_camera_pose_with_origin=function(){return t.asm._zappar_pipeline_camera_pose_with_origin.apply(null,arguments)},t._zappar_pipeline_create=function(){return t.asm._zappar_pipeline_create.apply(null,arguments)},t._zappar_pipeline_destroy=function(){return t.asm._zappar_pipeline_destroy.apply(null,arguments)},t._zappar_pipeline_frame_number=function(){return t.asm._zappar_pipeline_frame_number.apply(null,arguments)},t._zappar_pipeline_frame_update=function(){return t.asm._zappar_pipeline_frame_update.apply(null,arguments)},t._zappar_pipeline_motion_accelerometer_submit=function(){return t.asm._zappar_pipeline_motion_accelerometer_submit.apply(null,arguments)},t._zappar_pipeline_motion_attitude_submit=function(){return t.asm._zappar_pipeline_motion_attitude_submit.apply(null,arguments)},t._zappar_pipeline_motion_rotation_rate_submit=function(){return t.asm._zappar_pipeline_motion_rotation_rate_submit.apply(null,arguments)},t._zappar_pipeline_process_gl=function(){return t.asm._zappar_pipeline_process_gl.apply(null,arguments)},t.establishStackSpace=function(){return t.asm.establishStackSpace.apply(null,arguments)},t.getTempRet0=function(){return t.asm.getTempRet0.apply(null,arguments)},t.runPostSets=function(){return t.asm.runPostSets.apply(null,arguments)};var pn=t.setTempRet0=function(){return t.asm.setTempRet0.apply(null,arguments)};t.setThrew=function(){return t.asm.setThrew.apply(null,arguments)};var hn=t.stackAlloc=function(){return t.asm.stackAlloc.apply(null,arguments)},mn=t.stackRestore=function(){return t.asm.stackRestore.apply(null,arguments)},dn=t.stackSave=function(){return t.asm.stackSave.apply(null,arguments)};function bn(){function e(){if(!t.calledRun&&(t.calledRun=!0,!m)){if(ee||(ee=!0,Y(K)),Y(J),t.onRuntimeInitialized&&t.onRuntimeInitialized(),t.postRun)for("function"==typeof t.postRun&&(t.postRun=[t.postRun]);t.postRun.length;){var e=t.postRun.shift();$.unshift(e)}Y($)}}if(!(0<oe)){if(t.preRun)for("function"==typeof t.preRun&&(t.preRun=[t.preRun]);t.preRun.length;)te();Y(X),0<oe||t.calledRun||(t.setStatus?(t.setStatus("Running..."),setTimeout((function(){setTimeout((function(){t.setStatus("")}),1),e()}),1)):e())}}function yn(e){throw t.onAbort&&t.onAbort(e),void 0!==e?(s(e),u(e),e=JSON.stringify(e)):e="",m=!0,"abort("+e+"). Build with -s ASSERTIONS=1 for more info."}if(t.dynCall_i=function(){return t.asm.dynCall_i.apply(null,arguments)},t.dynCall_ii=function(){return t.asm.dynCall_ii.apply(null,arguments)},t.dynCall_iii=function(){return t.asm.dynCall_iii.apply(null,arguments)},t.dynCall_iiii=function(){return t.asm.dynCall_iiii.apply(null,arguments)},t.dynCall_iiiii=function(){return t.asm.dynCall_iiiii.apply(null,arguments)},t.dynCall_iiiiid=function(){return t.asm.dynCall_iiiiid.apply(null,arguments)},t.dynCall_iiiiii=function(){return t.asm.dynCall_iiiiii.apply(null,arguments)},t.dynCall_iiiiiid=function(){return t.asm.dynCall_iiiiiid.apply(null,arguments)},t.dynCall_iiiiiii=function(){return t.asm.dynCall_iiiiiii.apply(null,arguments)},t.dynCall_iiiiiiii=function(){return t.asm.dynCall_iiiiiiii.apply(null,arguments)},t.dynCall_iiiiiiiii=function(){return t.asm.dynCall_iiiiiiiii.apply(null,arguments)},t.dynCall_iiiiij=function(){return t.asm.dynCall_iiiiij.apply(null,arguments)},t.dynCall_iiji=function(){return t.asm.dynCall_iiji.apply(null,arguments)},t.dynCall_v=function(){return t.asm.dynCall_v.apply(null,arguments)},t.dynCall_vi=function(){return t.asm.dynCall_vi.apply(null,arguments)},t.dynCall_vii=function(){return t.asm.dynCall_vii.apply(null,arguments)},t.dynCall_viiffii=function(){return t.asm.dynCall_viiffii.apply(null,arguments)},t.dynCall_viii=function(){return t.asm.dynCall_viii.apply(null,arguments)},t.dynCall_viiifffii=function(){return t.asm.dynCall_viiifffii.apply(null,arguments)},t.dynCall_viiiffii=function(){return t.asm.dynCall_viiiffii.apply(null,arguments)},t.dynCall_viiii=function(){return t.asm.dynCall_viiii.apply(null,arguments)},t.dynCall_viiiii=function(){return t.asm.dynCall_viiiii.apply(null,arguments)},t.dynCall_viiiiiffffffffffffffff=function(){return t.asm.dynCall_viiiiiffffffffffffffff.apply(null,arguments)},t.dynCall_viiiiii=function(){return t.asm.dynCall_viiiiii.apply(null,arguments)},t.dynCall_viijii=function(){return t.asm.dynCall_viijii.apply(null,arguments)},t.dynCall_vij=function(){return t.asm.dynCall_vij.apply(null,arguments)},t.dynCall_viji=function(){return t.asm.dynCall_viji.apply(null,arguments)},t.dynCall_vijii=function(){return t.asm.dynCall_vijii.apply(null,arguments)},t.asm=Vr,t.cwrap=function(e,t,r,n){var a=(r=r||[]).every((function(e){return"number"===e}));return"string"!==t&&a&&!n?b(e):function(){var n=r,a=arguments,i=b(e),o=[],s=0;if(a)for(var u=0;u<a.length;u++){var _=v[n[u]];_?(0===s&&(s=dn()),o[u]=_(a[u])):o[u]=a[u]}return n=i.apply(null,o),n="string"===t?g(n):"boolean"===t?!!n:n,0!==s&&mn(s),n}},t.setValue=function(e,t,r){switch("*"===(r=r||"i8").charAt(r.length-1)&&(r="i32"),r){case"i1":case"i8":L[e>>0]=t;break;case"i16":C[e>>1]=t;break;case"i32":S[e>>2]=t;break;case"i64":tempI64=[t>>>0,(tempDouble=t,1<=+re(tempDouble)?0<tempDouble?(0|ie(+ae(tempDouble/4294967296),4294967295))>>>0:~~+ne((tempDouble-+(~~tempDouble>>>0))/4294967296)>>>0:0)],S[e>>2]=tempI64[0],S[e+4>>2]=tempI64[1];break;case"float":P[e>>2]=t;break;case"double":I[e>>3]=t;break;default:yn("invalid type for setValue: "+r)}},t.getValue=function(e,t){switch("*"===(t=t||"i8").charAt(t.length-1)&&(t="i32"),t){case"i1":case"i8":return L[e>>0];case"i16":return C[e>>1];case"i32":case"i64":return S[e>>2];case"float":return P[e>>2];case"double":return I[e>>3];default:yn("invalid type for getValue: "+t)}return null},t.UTF8ToString=k,t.then=function(e){if(t.calledRun)e(t);else{var r=t.onRuntimeInitialized;t.onRuntimeInitialized=function(){r&&r(),e(t)}}return t},ue=function e(){t.calledRun||bn(),t.calledRun||(ue=e)},t.run=bn,t.abort=yn,t.preInit)for("function"==typeof t.preInit&&(t.preInit=[t.preInit]);0<t.preInit.length;)t.preInit.pop()();return t.noExitRuntime=!0,bn(),e})},740:(e,t,r)=>{r.r(t),r.d(t,{default:()=>n});const n=r.p+"79a9ee7cc93d3f6956fc17a4ad1de0d5.wasm"},887:(e,t,r)=>{r.r(t),r.d(t,{glMatrix:()=>n,mat2:()=>a,mat2d:()=>i,mat3:()=>o,mat4:()=>s,quat:()=>c,quat2:()=>f,vec2:()=>l,vec3:()=>u,vec4:()=>_});var n={};r.r(n),r.d(n,{ARRAY_TYPE:()=>h,EPSILON:()=>p,RANDOM:()=>m,equals:()=>v,setMatrixArrayType:()=>d,toRadian:()=>y});var a={};r.r(a),r.d(a,{LDU:()=>D,add:()=>j,adjoint:()=>E,clone:()=>w,copy:()=>M,create:()=>g,determinant:()=>C,equals:()=>q,exactEquals:()=>V,frob:()=>F,fromRotation:()=>P,fromScaling:()=>I,fromValues:()=>z,identity:()=>k,invert:()=>L,mul:()=>U,multiply:()=>O,multiplyScalar:()=>G,multiplyScalarAndAdd:()=>N,rotate:()=>S,scale:()=>T,set:()=>A,str:()=>B,sub:()=>W,subtract:()=>R,transpose:()=>x});var i={};r.r(i),r.d(i,{add:()=>_e,clone:()=>Z,copy:()=>Y,create:()=>H,determinant:()=>$,equals:()=>he,exactEquals:()=>pe,frob:()=>ue,fromRotation:()=>ae,fromScaling:()=>ie,fromTranslation:()=>oe,fromValues:()=>K,identity:()=>X,invert:()=>Q,mul:()=>me,multiply:()=>ee,multiplyScalar:()=>fe,multiplyScalarAndAdd:()=>le,rotate:()=>te,scale:()=>re,set:()=>J,str:()=>se,sub:()=>de,subtract:()=>ce,translate:()=>ne});var o={};r.r(o),r.d(o,{add:()=>qe,adjoint:()=>xe,clone:()=>ve,copy:()=>ge,create:()=>be,determinant:()=>Le,equals:()=>He,exactEquals:()=>We,frob:()=>Ve,fromMat2d:()=>Be,fromMat4:()=>ye,fromQuat:()=>Fe,fromRotation:()=>Pe,fromScaling:()=>Ie,fromTranslation:()=>Te,fromValues:()=>we,identity:()=>ke,invert:()=>Ae,mul:()=>Ze,multiply:()=>Ee,multiplyScalar:()=>Ne,multiplyScalarAndAdd:()=>Ue,normalFromMat4:()=>De,projection:()=>je,rotate:()=>Oe,scale:()=>Se,set:()=>Me,str:()=>Re,sub:()=>Ye,subtract:()=>Ge,translate:()=>Ce,transpose:()=>ze});var s={};r.r(s),r.d(s,{add:()=>It,adjoint:()=>nt,clone:()=>Ke,copy:()=>Je,create:()=>Xe,determinant:()=>at,equals:()=>Rt,exactEquals:()=>jt,frob:()=>Pt,fromQuat:()=>At,fromQuat2:()=>vt,fromRotation:()=>ht,fromRotationTranslation:()=>yt,fromRotationTranslationScale:()=>kt,fromRotationTranslationScaleOrigin:()=>zt,fromScaling:()=>pt,fromTranslation:()=>lt,fromValues:()=>Qe,fromXRotation:()=>mt,fromYRotation:()=>dt,fromZRotation:()=>bt,frustum:()=>xt,getRotation:()=>Mt,getScaling:()=>wt,getTranslation:()=>gt,identity:()=>et,invert:()=>rt,lookAt:()=>Ot,mul:()=>Vt,multiply:()=>it,multiplyScalar:()=>Ft,multiplyScalarAndAdd:()=>Dt,ortho:()=>Ct,perspective:()=>Lt,perspectiveFromFieldOfView:()=>Et,rotate:()=>ut,rotateX:()=>_t,rotateY:()=>ct,rotateZ:()=>ft,scale:()=>st,set:()=>$e,str:()=>Tt,sub:()=>qt,subtract:()=>Bt,targetTo:()=>St,translate:()=>ot,transpose:()=>tt});var u={};r.r(u),r.d(u,{add:()=>Yt,angle:()=>kr,bezier:()=>mr,ceil:()=>Qt,clone:()=>Nt,copy:()=>Ht,create:()=>Gt,cross:()=>lr,dist:()=>Tr,distance:()=>ir,div:()=>Sr,divide:()=>Jt,dot:()=>fr,equals:()=>Lr,exactEquals:()=>xr,floor:()=>$t,forEach:()=>Fr,fromValues:()=>Wt,hermite:()=>hr,inverse:()=>_r,len:()=>Ir,length:()=>Ut,lerp:()=>pr,max:()=>tr,min:()=>er,mul:()=>Or,multiply:()=>Kt,negate:()=>ur,normalize:()=>cr,random:()=>dr,rotateX:()=>gr,rotateY:()=>wr,rotateZ:()=>Mr,round:()=>rr,scale:()=>nr,scaleAndAdd:()=>ar,set:()=>Zt,sqrDist:()=>Pr,sqrLen:()=>Br,squaredDistance:()=>or,squaredLength:()=>sr,str:()=>Ar,sub:()=>Cr,subtract:()=>Xt,transformMat3:()=>yr,transformMat4:()=>br,transformQuat:()=>vr,zero:()=>zr});var _={};r.r(_),r.d(_,{add:()=>Gr,ceil:()=>Hr,clone:()=>jr,copy:()=>Vr,create:()=>Dr,cross:()=>un,dist:()=>gn,distance:()=>$r,div:()=>vn,divide:()=>Wr,dot:()=>sn,equals:()=>dn,exactEquals:()=>mn,floor:()=>Zr,forEach:()=>zn,fromValues:()=>Rr,inverse:()=>an,len:()=>Mn,length:()=>tn,lerp:()=>_n,max:()=>Xr,min:()=>Yr,mul:()=>yn,multiply:()=>Ur,negate:()=>nn,normalize:()=>on,random:()=>cn,round:()=>Kr,scale:()=>Jr,scaleAndAdd:()=>Qr,set:()=>qr,sqrDist:()=>wn,sqrLen:()=>kn,squaredDistance:()=>en,squaredLength:()=>rn,str:()=>hn,sub:()=>bn,subtract:()=>Nr,transformMat4:()=>fn,transformQuat:()=>ln,zero:()=>pn});var c={};r.r(c),r.d(c,{add:()=>ta,calculateW:()=>In,clone:()=>Jn,conjugate:()=>qn,copy:()=>$n,create:()=>An,dot:()=>aa,equals:()=>la,exactEquals:()=>fa,exp:()=>Bn,fromEuler:()=>Nn,fromMat3:()=>Gn,fromValues:()=>Qn,getAngle:()=>Cn,getAxisAngle:()=>En,identity:()=>xn,invert:()=>Vn,len:()=>sa,length:()=>oa,lerp:()=>ia,ln:()=>Fn,mul:()=>ra,multiply:()=>On,normalize:()=>ca,pow:()=>Dn,random:()=>Rn,rotateX:()=>Sn,rotateY:()=>Tn,rotateZ:()=>Pn,rotationTo:()=>pa,scale:()=>na,set:()=>ea,setAxes:()=>ma,setAxisAngle:()=>Ln,slerp:()=>jn,sqlerp:()=>ha,sqrLen:()=>_a,squaredLength:()=>ua,str:()=>Un});var f={};r.r(f),r.d(f,{add:()=>Ra,clone:()=>ba,conjugate:()=>Ha,copy:()=>za,create:()=>da,dot:()=>Na,equals:()=>ei,exactEquals:()=>$a,fromMat4:()=>ka,fromRotation:()=>Ma,fromRotationTranslation:()=>ga,fromRotationTranslationValues:()=>va,fromTranslation:()=>wa,fromValues:()=>ya,getDual:()=>Ea,getReal:()=>La,getTranslation:()=>Sa,identity:()=>Aa,invert:()=>Wa,len:()=>Ya,length:()=>Za,lerp:()=>Ua,mul:()=>qa,multiply:()=>Va,normalize:()=>Ja,rotateAroundAxis:()=>ja,rotateByQuatAppend:()=>Fa,rotateByQuatPrepend:()=>Da,rotateX:()=>Pa,rotateY:()=>Ia,rotateZ:()=>Ba,scale:()=>Ga,set:()=>xa,setDual:()=>Oa,setReal:()=>Ca,sqrLen:()=>Ka,squaredLength:()=>Xa,str:()=>Qa,translate:()=>Ta});var l={};r.r(l),r.d(l,{add:()=>oi,angle:()=>Pi,ceil:()=>ci,clone:()=>ri,copy:()=>ai,create:()=>ti,cross:()=>Ai,dist:()=>Gi,distance:()=>bi,div:()=>qi,divide:()=>_i,dot:()=>zi,equals:()=>Di,exactEquals:()=>Fi,floor:()=>fi,forEach:()=>Wi,fromValues:()=>ni,inverse:()=>Mi,len:()=>ji,length:()=>vi,lerp:()=>xi,max:()=>pi,min:()=>li,mul:()=>Vi,multiply:()=>ui,negate:()=>wi,normalize:()=>ki,random:()=>Li,rotate:()=>Ti,round:()=>hi,scale:()=>mi,scaleAndAdd:()=>di,set:()=>ii,sqrDist:()=>Ni,sqrLen:()=>Ui,squaredDistance:()=>yi,squaredLength:()=>gi,str:()=>Bi,sub:()=>Ri,subtract:()=>si,transformMat2:()=>Ei,transformMat2d:()=>Ci,transformMat3:()=>Oi,transformMat4:()=>Si,zero:()=>Ii});var p=1e-6,h="undefined"!=typeof Float32Array?Float32Array:Array,m=Math.random;function d(e){h=e}var b=Math.PI/180;function y(e){return e*b}function v(e,t){return Math.abs(e-t)<=p*Math.max(1,Math.abs(e),Math.abs(t))}function g(){var e=new h(4);return h!=Float32Array&&(e[1]=0,e[2]=0),e[0]=1,e[3]=1,e}function w(e){var t=new h(4);return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t}function M(e,t){return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e}function k(e){return e[0]=1,e[1]=0,e[2]=0,e[3]=1,e}function z(e,t,r,n){var a=new h(4);return a[0]=e,a[1]=t,a[2]=r,a[3]=n,a}function A(e,t,r,n,a){return e[0]=t,e[1]=r,e[2]=n,e[3]=a,e}function x(e,t){if(e===t){var r=t[1];e[1]=t[2],e[2]=r}else e[0]=t[0],e[1]=t[2],e[2]=t[1],e[3]=t[3];return e}function L(e,t){var r=t[0],n=t[1],a=t[2],i=t[3],o=r*i-a*n;return o?(o=1/o,e[0]=i*o,e[1]=-n*o,e[2]=-a*o,e[3]=r*o,e):null}function E(e,t){var r=t[0];return e[0]=t[3],e[1]=-t[1],e[2]=-t[2],e[3]=r,e}function C(e){return e[0]*e[3]-e[2]*e[1]}function O(e,t,r){var n=t[0],a=t[1],i=t[2],o=t[3],s=r[0],u=r[1],_=r[2],c=r[3];return e[0]=n*s+i*u,e[1]=a*s+o*u,e[2]=n*_+i*c,e[3]=a*_+o*c,e}function S(e,t,r){var n=t[0],a=t[1],i=t[2],o=t[3],s=Math.sin(r),u=Math.cos(r);return e[0]=n*u+i*s,e[1]=a*u+o*s,e[2]=n*-s+i*u,e[3]=a*-s+o*u,e}function T(e,t,r){var n=t[0],a=t[1],i=t[2],o=t[3],s=r[0],u=r[1];return e[0]=n*s,e[1]=a*s,e[2]=i*u,e[3]=o*u,e}function P(e,t){var r=Math.sin(t),n=Math.cos(t);return e[0]=n,e[1]=r,e[2]=-r,e[3]=n,e}function I(e,t){return e[0]=t[0],e[1]=0,e[2]=0,e[3]=t[1],e}function B(e){return"mat2("+e[0]+", "+e[1]+", "+e[2]+", "+e[3]+")"}function F(e){return Math.hypot(e[0],e[1],e[2],e[3])}function D(e,t,r,n){return e[2]=n[2]/n[0],r[0]=n[0],r[1]=n[1],r[3]=n[3]-e[2]*r[1],[e,t,r]}function j(e,t,r){return e[0]=t[0]+r[0],e[1]=t[1]+r[1],e[2]=t[2]+r[2],e[3]=t[3]+r[3],e}function R(e,t,r){return e[0]=t[0]-r[0],e[1]=t[1]-r[1],e[2]=t[2]-r[2],e[3]=t[3]-r[3],e}function V(e,t){return e[0]===t[0]&&e[1]===t[1]&&e[2]===t[2]&&e[3]===t[3]}function q(e,t){var r=e[0],n=e[1],a=e[2],i=e[3],o=t[0],s=t[1],u=t[2],_=t[3];return Math.abs(r-o)<=p*Math.max(1,Math.abs(r),Math.abs(o))&&Math.abs(n-s)<=p*Math.max(1,Math.abs(n),Math.abs(s))&&Math.abs(a-u)<=p*Math.max(1,Math.abs(a),Math.abs(u))&&Math.abs(i-_)<=p*Math.max(1,Math.abs(i),Math.abs(_))}function G(e,t,r){return e[0]=t[0]*r,e[1]=t[1]*r,e[2]=t[2]*r,e[3]=t[3]*r,e}function N(e,t,r,n){return e[0]=t[0]+r[0]*n,e[1]=t[1]+r[1]*n,e[2]=t[2]+r[2]*n,e[3]=t[3]+r[3]*n,e}Math.hypot||(Math.hypot=function(){for(var e=0,t=arguments.length;t--;)e+=arguments[t]*arguments[t];return Math.sqrt(e)});var U=O,W=R;function H(){var e=new h(6);return h!=Float32Array&&(e[1]=0,e[2]=0,e[4]=0,e[5]=0),e[0]=1,e[3]=1,e}function Z(e){var t=new h(6);return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t}function Y(e,t){return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e}function X(e){return e[0]=1,e[1]=0,e[2]=0,e[3]=1,e[4]=0,e[5]=0,e}function K(e,t,r,n,a,i){var o=new h(6);return o[0]=e,o[1]=t,o[2]=r,o[3]=n,o[4]=a,o[5]=i,o}function J(e,t,r,n,a,i,o){return e[0]=t,e[1]=r,e[2]=n,e[3]=a,e[4]=i,e[5]=o,e}function Q(e,t){var r=t[0],n=t[1],a=t[2],i=t[3],o=t[4],s=t[5],u=r*i-n*a;return u?(u=1/u,e[0]=i*u,e[1]=-n*u,e[2]=-a*u,e[3]=r*u,e[4]=(a*s-i*o)*u,e[5]=(n*o-r*s)*u,e):null}function $(e){return e[0]*e[3]-e[1]*e[2]}function ee(e,t,r){var n=t[0],a=t[1],i=t[2],o=t[3],s=t[4],u=t[5],_=r[0],c=r[1],f=r[2],l=r[3],p=r[4],h=r[5];return e[0]=n*_+i*c,e[1]=a*_+o*c,e[2]=n*f+i*l,e[3]=a*f+o*l,e[4]=n*p+i*h+s,e[5]=a*p+o*h+u,e}function te(e,t,r){var n=t[0],a=t[1],i=t[2],o=t[3],s=t[4],u=t[5],_=Math.sin(r),c=Math.cos(r);return e[0]=n*c+i*_,e[1]=a*c+o*_,e[2]=n*-_+i*c,e[3]=a*-_+o*c,e[4]=s,e[5]=u,e}function re(e,t,r){var n=t[0],a=t[1],i=t[2],o=t[3],s=t[4],u=t[5],_=r[0],c=r[1];return e[0]=n*_,e[1]=a*_,e[2]=i*c,e[3]=o*c,e[4]=s,e[5]=u,e}function ne(e,t,r){var n=t[0],a=t[1],i=t[2],o=t[3],s=t[4],u=t[5],_=r[0],c=r[1];return e[0]=n,e[1]=a,e[2]=i,e[3]=o,e[4]=n*_+i*c+s,e[5]=a*_+o*c+u,e}function ae(e,t){var r=Math.sin(t),n=Math.cos(t);return e[0]=n,e[1]=r,e[2]=-r,e[3]=n,e[4]=0,e[5]=0,e}function ie(e,t){return e[0]=t[0],e[1]=0,e[2]=0,e[3]=t[1],e[4]=0,e[5]=0,e}function oe(e,t){return e[0]=1,e[1]=0,e[2]=0,e[3]=1,e[4]=t[0],e[5]=t[1],e}function se(e){return"mat2d("+e[0]+", "+e[1]+", "+e[2]+", "+e[3]+", "+e[4]+", "+e[5]+")"}function ue(e){return Math.hypot(e[0],e[1],e[2],e[3],e[4],e[5],1)}function _e(e,t,r){return e[0]=t[0]+r[0],e[1]=t[1]+r[1],e[2]=t[2]+r[2],e[3]=t[3]+r[3],e[4]=t[4]+r[4],e[5]=t[5]+r[5],e}function ce(e,t,r){return e[0]=t[0]-r[0],e[1]=t[1]-r[1],e[2]=t[2]-r[2],e[3]=t[3]-r[3],e[4]=t[4]-r[4],e[5]=t[5]-r[5],e}function fe(e,t,r){return e[0]=t[0]*r,e[1]=t[1]*r,e[2]=t[2]*r,e[3]=t[3]*r,e[4]=t[4]*r,e[5]=t[5]*r,e}function le(e,t,r,n){return e[0]=t[0]+r[0]*n,e[1]=t[1]+r[1]*n,e[2]=t[2]+r[2]*n,e[3]=t[3]+r[3]*n,e[4]=t[4]+r[4]*n,e[5]=t[5]+r[5]*n,e}function pe(e,t){return e[0]===t[0]&&e[1]===t[1]&&e[2]===t[2]&&e[3]===t[3]&&e[4]===t[4]&&e[5]===t[5]}function he(e,t){var r=e[0],n=e[1],a=e[2],i=e[3],o=e[4],s=e[5],u=t[0],_=t[1],c=t[2],f=t[3],l=t[4],h=t[5];return Math.abs(r-u)<=p*Math.max(1,Math.abs(r),Math.abs(u))&&Math.abs(n-_)<=p*Math.max(1,Math.abs(n),Math.abs(_))&&Math.abs(a-c)<=p*Math.max(1,Math.abs(a),Math.abs(c))&&Math.abs(i-f)<=p*Math.max(1,Math.abs(i),Math.abs(f))&&Math.abs(o-l)<=p*Math.max(1,Math.abs(o),Math.abs(l))&&Math.abs(s-h)<=p*Math.max(1,Math.abs(s),Math.abs(h))}var me=ee,de=ce;function be(){var e=new h(9);return h!=Float32Array&&(e[1]=0,e[2]=0,e[3]=0,e[5]=0,e[6]=0,e[7]=0),e[0]=1,e[4]=1,e[8]=1,e}function ye(e,t){return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[4],e[4]=t[5],e[5]=t[6],e[6]=t[8],e[7]=t[9],e[8]=t[10],e}function ve(e){var t=new h(9);return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t}function ge(e,t){return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[8]=t[8],e}function we(e,t,r,n,a,i,o,s,u){var _=new h(9);return _[0]=e,_[1]=t,_[2]=r,_[3]=n,_[4]=a,_[5]=i,_[6]=o,_[7]=s,_[8]=u,_}function Me(e,t,r,n,a,i,o,s,u,_){return e[0]=t,e[1]=r,e[2]=n,e[3]=a,e[4]=i,e[5]=o,e[6]=s,e[7]=u,e[8]=_,e}function ke(e){return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=1,e[5]=0,e[6]=0,e[7]=0,e[8]=1,e}function ze(e,t){if(e===t){var r=t[1],n=t[2],a=t[5];e[1]=t[3],e[2]=t[6],e[3]=r,e[5]=t[7],e[6]=n,e[7]=a}else e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8];return e}function Ae(e,t){var r=t[0],n=t[1],a=t[2],i=t[3],o=t[4],s=t[5],u=t[6],_=t[7],c=t[8],f=c*o-s*_,l=-c*i+s*u,p=_*i-o*u,h=r*f+n*l+a*p;return h?(h=1/h,e[0]=f*h,e[1]=(-c*n+a*_)*h,e[2]=(s*n-a*o)*h,e[3]=l*h,e[4]=(c*r-a*u)*h,e[5]=(-s*r+a*i)*h,e[6]=p*h,e[7]=(-_*r+n*u)*h,e[8]=(o*r-n*i)*h,e):null}function xe(e,t){var r=t[0],n=t[1],a=t[2],i=t[3],o=t[4],s=t[5],u=t[6],_=t[7],c=t[8];return e[0]=o*c-s*_,e[1]=a*_-n*c,e[2]=n*s-a*o,e[3]=s*u-i*c,e[4]=r*c-a*u,e[5]=a*i-r*s,e[6]=i*_-o*u,e[7]=n*u-r*_,e[8]=r*o-n*i,e}function Le(e){var t=e[0],r=e[1],n=e[2],a=e[3],i=e[4],o=e[5],s=e[6],u=e[7],_=e[8];return t*(_*i-o*u)+r*(-_*a+o*s)+n*(u*a-i*s)}function Ee(e,t,r){var n=t[0],a=t[1],i=t[2],o=t[3],s=t[4],u=t[5],_=t[6],c=t[7],f=t[8],l=r[0],p=r[1],h=r[2],m=r[3],d=r[4],b=r[5],y=r[6],v=r[7],g=r[8];return e[0]=l*n+p*o+h*_,e[1]=l*a+p*s+h*c,e[2]=l*i+p*u+h*f,e[3]=m*n+d*o+b*_,e[4]=m*a+d*s+b*c,e[5]=m*i+d*u+b*f,e[6]=y*n+v*o+g*_,e[7]=y*a+v*s+g*c,e[8]=y*i+v*u+g*f,e}function Ce(e,t,r){var n=t[0],a=t[1],i=t[2],o=t[3],s=t[4],u=t[5],_=t[6],c=t[7],f=t[8],l=r[0],p=r[1];return e[0]=n,e[1]=a,e[2]=i,e[3]=o,e[4]=s,e[5]=u,e[6]=l*n+p*o+_,e[7]=l*a+p*s+c,e[8]=l*i+p*u+f,e}function Oe(e,t,r){var n=t[0],a=t[1],i=t[2],o=t[3],s=t[4],u=t[5],_=t[6],c=t[7],f=t[8],l=Math.sin(r),p=Math.cos(r);return e[0]=p*n+l*o,e[1]=p*a+l*s,e[2]=p*i+l*u,e[3]=p*o-l*n,e[4]=p*s-l*a,e[5]=p*u-l*i,e[6]=_,e[7]=c,e[8]=f,e}function Se(e,t,r){var n=r[0],a=r[1];return e[0]=n*t[0],e[1]=n*t[1],e[2]=n*t[2],e[3]=a*t[3],e[4]=a*t[4],e[5]=a*t[5],e[6]=t[6],e[7]=t[7],e[8]=t[8],e}function Te(e,t){return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=1,e[5]=0,e[6]=t[0],e[7]=t[1],e[8]=1,e}function Pe(e,t){var r=Math.sin(t),n=Math.cos(t);return e[0]=n,e[1]=r,e[2]=0,e[3]=-r,e[4]=n,e[5]=0,e[6]=0,e[7]=0,e[8]=1,e}function Ie(e,t){return e[0]=t[0],e[1]=0,e[2]=0,e[3]=0,e[4]=t[1],e[5]=0,e[6]=0,e[7]=0,e[8]=1,e}function Be(e,t){return e[0]=t[0],e[1]=t[1],e[2]=0,e[3]=t[2],e[4]=t[3],e[5]=0,e[6]=t[4],e[7]=t[5],e[8]=1,e}function Fe(e,t){var r=t[0],n=t[1],a=t[2],i=t[3],o=r+r,s=n+n,u=a+a,_=r*o,c=n*o,f=n*s,l=a*o,p=a*s,h=a*u,m=i*o,d=i*s,b=i*u;return e[0]=1-f-h,e[3]=c-b,e[6]=l+d,e[1]=c+b,e[4]=1-_-h,e[7]=p-m,e[2]=l-d,e[5]=p+m,e[8]=1-_-f,e}function De(e,t){var r=t[0],n=t[1],a=t[2],i=t[3],o=t[4],s=t[5],u=t[6],_=t[7],c=t[8],f=t[9],l=t[10],p=t[11],h=t[12],m=t[13],d=t[14],b=t[15],y=r*s-n*o,v=r*u-a*o,g=r*_-i*o,w=n*u-a*s,M=n*_-i*s,k=a*_-i*u,z=c*m-f*h,A=c*d-l*h,x=c*b-p*h,L=f*d-l*m,E=f*b-p*m,C=l*b-p*d,O=y*C-v*E+g*L+w*x-M*A+k*z;return O?(O=1/O,e[0]=(s*C-u*E+_*L)*O,e[1]=(u*x-o*C-_*A)*O,e[2]=(o*E-s*x+_*z)*O,e[3]=(a*E-n*C-i*L)*O,e[4]=(r*C-a*x+i*A)*O,e[5]=(n*x-r*E-i*z)*O,e[6]=(m*k-d*M+b*w)*O,e[7]=(d*g-h*k-b*v)*O,e[8]=(h*M-m*g+b*y)*O,e):null}function je(e,t,r){return e[0]=2/t,e[1]=0,e[2]=0,e[3]=0,e[4]=-2/r,e[5]=0,e[6]=-1,e[7]=1,e[8]=1,e}function Re(e){return"mat3("+e[0]+", "+e[1]+", "+e[2]+", "+e[3]+", "+e[4]+", "+e[5]+", "+e[6]+", "+e[7]+", "+e[8]+")"}function Ve(e){return Math.hypot(e[0],e[1],e[2],e[3],e[4],e[5],e[6],e[7],e[8])}function qe(e,t,r){return e[0]=t[0]+r[0],e[1]=t[1]+r[1],e[2]=t[2]+r[2],e[3]=t[3]+r[3],e[4]=t[4]+r[4],e[5]=t[5]+r[5],e[6]=t[6]+r[6],e[7]=t[7]+r[7],e[8]=t[8]+r[8],e}function Ge(e,t,r){return e[0]=t[0]-r[0],e[1]=t[1]-r[1],e[2]=t[2]-r[2],e[3]=t[3]-r[3],e[4]=t[4]-r[4],e[5]=t[5]-r[5],e[6]=t[6]-r[6],e[7]=t[7]-r[7],e[8]=t[8]-r[8],e}function Ne(e,t,r){return e[0]=t[0]*r,e[1]=t[1]*r,e[2]=t[2]*r,e[3]=t[3]*r,e[4]=t[4]*r,e[5]=t[5]*r,e[6]=t[6]*r,e[7]=t[7]*r,e[8]=t[8]*r,e}function Ue(e,t,r,n){return e[0]=t[0]+r[0]*n,e[1]=t[1]+r[1]*n,e[2]=t[2]+r[2]*n,e[3]=t[3]+r[3]*n,e[4]=t[4]+r[4]*n,e[5]=t[5]+r[5]*n,e[6]=t[6]+r[6]*n,e[7]=t[7]+r[7]*n,e[8]=t[8]+r[8]*n,e}function We(e,t){return e[0]===t[0]&&e[1]===t[1]&&e[2]===t[2]&&e[3]===t[3]&&e[4]===t[4]&&e[5]===t[5]&&e[6]===t[6]&&e[7]===t[7]&&e[8]===t[8]}function He(e,t){var r=e[0],n=e[1],a=e[2],i=e[3],o=e[4],s=e[5],u=e[6],_=e[7],c=e[8],f=t[0],l=t[1],h=t[2],m=t[3],d=t[4],b=t[5],y=t[6],v=t[7],g=t[8];return Math.abs(r-f)<=p*Math.max(1,Math.abs(r),Math.abs(f))&&Math.abs(n-l)<=p*Math.max(1,Math.abs(n),Math.abs(l))&&Math.abs(a-h)<=p*Math.max(1,Math.abs(a),Math.abs(h))&&Math.abs(i-m)<=p*Math.max(1,Math.abs(i),Math.abs(m))&&Math.abs(o-d)<=p*Math.max(1,Math.abs(o),Math.abs(d))&&Math.abs(s-b)<=p*Math.max(1,Math.abs(s),Math.abs(b))&&Math.abs(u-y)<=p*Math.max(1,Math.abs(u),Math.abs(y))&&Math.abs(_-v)<=p*Math.max(1,Math.abs(_),Math.abs(v))&&Math.abs(c-g)<=p*Math.max(1,Math.abs(c),Math.abs(g))}var Ze=Ee,Ye=Ge;function Xe(){var e=new h(16);return h!=Float32Array&&(e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0),e[0]=1,e[5]=1,e[10]=1,e[15]=1,e}function Ke(e){var t=new h(16);return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t[9]=e[9],t[10]=e[10],t[11]=e[11],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15],t}function Je(e,t){return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[8]=t[8],e[9]=t[9],e[10]=t[10],e[11]=t[11],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15],e}function Qe(e,t,r,n,a,i,o,s,u,_,c,f,l,p,m,d){var b=new h(16);return b[0]=e,b[1]=t,b[2]=r,b[3]=n,b[4]=a,b[5]=i,b[6]=o,b[7]=s,b[8]=u,b[9]=_,b[10]=c,b[11]=f,b[12]=l,b[13]=p,b[14]=m,b[15]=d,b}function $e(e,t,r,n,a,i,o,s,u,_,c,f,l,p,h,m,d){return e[0]=t,e[1]=r,e[2]=n,e[3]=a,e[4]=i,e[5]=o,e[6]=s,e[7]=u,e[8]=_,e[9]=c,e[10]=f,e[11]=l,e[12]=p,e[13]=h,e[14]=m,e[15]=d,e}function et(e){return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=1,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=1,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function tt(e,t){if(e===t){var r=t[1],n=t[2],a=t[3],i=t[6],o=t[7],s=t[11];e[1]=t[4],e[2]=t[8],e[3]=t[12],e[4]=r,e[6]=t[9],e[7]=t[13],e[8]=n,e[9]=i,e[11]=t[14],e[12]=a,e[13]=o,e[14]=s}else e[0]=t[0],e[1]=t[4],e[2]=t[8],e[3]=t[12],e[4]=t[1],e[5]=t[5],e[6]=t[9],e[7]=t[13],e[8]=t[2],e[9]=t[6],e[10]=t[10],e[11]=t[14],e[12]=t[3],e[13]=t[7],e[14]=t[11],e[15]=t[15];return e}function rt(e,t){var r=t[0],n=t[1],a=t[2],i=t[3],o=t[4],s=t[5],u=t[6],_=t[7],c=t[8],f=t[9],l=t[10],p=t[11],h=t[12],m=t[13],d=t[14],b=t[15],y=r*s-n*o,v=r*u-a*o,g=r*_-i*o,w=n*u-a*s,M=n*_-i*s,k=a*_-i*u,z=c*m-f*h,A=c*d-l*h,x=c*b-p*h,L=f*d-l*m,E=f*b-p*m,C=l*b-p*d,O=y*C-v*E+g*L+w*x-M*A+k*z;return O?(O=1/O,e[0]=(s*C-u*E+_*L)*O,e[1]=(a*E-n*C-i*L)*O,e[2]=(m*k-d*M+b*w)*O,e[3]=(l*M-f*k-p*w)*O,e[4]=(u*x-o*C-_*A)*O,e[5]=(r*C-a*x+i*A)*O,e[6]=(d*g-h*k-b*v)*O,e[7]=(c*k-l*g+p*v)*O,e[8]=(o*E-s*x+_*z)*O,e[9]=(n*x-r*E-i*z)*O,e[10]=(h*M-m*g+b*y)*O,e[11]=(f*g-c*M-p*y)*O,e[12]=(s*A-o*L-u*z)*O,e[13]=(r*L-n*A+a*z)*O,e[14]=(m*v-h*w-d*y)*O,e[15]=(c*w-f*v+l*y)*O,e):null}function nt(e,t){var r=t[0],n=t[1],a=t[2],i=t[3],o=t[4],s=t[5],u=t[6],_=t[7],c=t[8],f=t[9],l=t[10],p=t[11],h=t[12],m=t[13],d=t[14],b=t[15];return e[0]=s*(l*b-p*d)-f*(u*b-_*d)+m*(u*p-_*l),e[1]=-(n*(l*b-p*d)-f*(a*b-i*d)+m*(a*p-i*l)),e[2]=n*(u*b-_*d)-s*(a*b-i*d)+m*(a*_-i*u),e[3]=-(n*(u*p-_*l)-s*(a*p-i*l)+f*(a*_-i*u)),e[4]=-(o*(l*b-p*d)-c*(u*b-_*d)+h*(u*p-_*l)),e[5]=r*(l*b-p*d)-c*(a*b-i*d)+h*(a*p-i*l),e[6]=-(r*(u*b-_*d)-o*(a*b-i*d)+h*(a*_-i*u)),e[7]=r*(u*p-_*l)-o*(a*p-i*l)+c*(a*_-i*u),e[8]=o*(f*b-p*m)-c*(s*b-_*m)+h*(s*p-_*f),e[9]=-(r*(f*b-p*m)-c*(n*b-i*m)+h*(n*p-i*f)),e[10]=r*(s*b-_*m)-o*(n*b-i*m)+h*(n*_-i*s),e[11]=-(r*(s*p-_*f)-o*(n*p-i*f)+c*(n*_-i*s)),e[12]=-(o*(f*d-l*m)-c*(s*d-u*m)+h*(s*l-u*f)),e[13]=r*(f*d-l*m)-c*(n*d-a*m)+h*(n*l-a*f),e[14]=-(r*(s*d-u*m)-o*(n*d-a*m)+h*(n*u-a*s)),e[15]=r*(s*l-u*f)-o*(n*l-a*f)+c*(n*u-a*s),e}function at(e){var t=e[0],r=e[1],n=e[2],a=e[3],i=e[4],o=e[5],s=e[6],u=e[7],_=e[8],c=e[9],f=e[10],l=e[11],p=e[12],h=e[13],m=e[14],d=e[15];return(t*o-r*i)*(f*d-l*m)-(t*s-n*i)*(c*d-l*h)+(t*u-a*i)*(c*m-f*h)+(r*s-n*o)*(_*d-l*p)-(r*u-a*o)*(_*m-f*p)+(n*u-a*s)*(_*h-c*p)}function it(e,t,r){var n=t[0],a=t[1],i=t[2],o=t[3],s=t[4],u=t[5],_=t[6],c=t[7],f=t[8],l=t[9],p=t[10],h=t[11],m=t[12],d=t[13],b=t[14],y=t[15],v=r[0],g=r[1],w=r[2],M=r[3];return e[0]=v*n+g*s+w*f+M*m,e[1]=v*a+g*u+w*l+M*d,e[2]=v*i+g*_+w*p+M*b,e[3]=v*o+g*c+w*h+M*y,v=r[4],g=r[5],w=r[6],M=r[7],e[4]=v*n+g*s+w*f+M*m,e[5]=v*a+g*u+w*l+M*d,e[6]=v*i+g*_+w*p+M*b,e[7]=v*o+g*c+w*h+M*y,v=r[8],g=r[9],w=r[10],M=r[11],e[8]=v*n+g*s+w*f+M*m,e[9]=v*a+g*u+w*l+M*d,e[10]=v*i+g*_+w*p+M*b,e[11]=v*o+g*c+w*h+M*y,v=r[12],g=r[13],w=r[14],M=r[15],e[12]=v*n+g*s+w*f+M*m,e[13]=v*a+g*u+w*l+M*d,e[14]=v*i+g*_+w*p+M*b,e[15]=v*o+g*c+w*h+M*y,e}function ot(e,t,r){var n,a,i,o,s,u,_,c,f,l,p,h,m=r[0],d=r[1],b=r[2];return t===e?(e[12]=t[0]*m+t[4]*d+t[8]*b+t[12],e[13]=t[1]*m+t[5]*d+t[9]*b+t[13],e[14]=t[2]*m+t[6]*d+t[10]*b+t[14],e[15]=t[3]*m+t[7]*d+t[11]*b+t[15]):(n=t[0],a=t[1],i=t[2],o=t[3],s=t[4],u=t[5],_=t[6],c=t[7],f=t[8],l=t[9],p=t[10],h=t[11],e[0]=n,e[1]=a,e[2]=i,e[3]=o,e[4]=s,e[5]=u,e[6]=_,e[7]=c,e[8]=f,e[9]=l,e[10]=p,e[11]=h,e[12]=n*m+s*d+f*b+t[12],e[13]=a*m+u*d+l*b+t[13],e[14]=i*m+_*d+p*b+t[14],e[15]=o*m+c*d+h*b+t[15]),e}function st(e,t,r){var n=r[0],a=r[1],i=r[2];return e[0]=t[0]*n,e[1]=t[1]*n,e[2]=t[2]*n,e[3]=t[3]*n,e[4]=t[4]*a,e[5]=t[5]*a,e[6]=t[6]*a,e[7]=t[7]*a,e[8]=t[8]*i,e[9]=t[9]*i,e[10]=t[10]*i,e[11]=t[11]*i,e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15],e}function ut(e,t,r,n){var a,i,o,s,u,_,c,f,l,h,m,d,b,y,v,g,w,M,k,z,A,x,L,E,C=n[0],O=n[1],S=n[2],T=Math.hypot(C,O,S);return T<p?null:(C*=T=1/T,O*=T,S*=T,a=Math.sin(r),o=1-(i=Math.cos(r)),s=t[0],u=t[1],_=t[2],c=t[3],f=t[4],l=t[5],h=t[6],m=t[7],d=t[8],b=t[9],y=t[10],v=t[11],g=C*C*o+i,w=O*C*o+S*a,M=S*C*o-O*a,k=C*O*o-S*a,z=O*O*o+i,A=S*O*o+C*a,x=C*S*o+O*a,L=O*S*o-C*a,E=S*S*o+i,e[0]=s*g+f*w+d*M,e[1]=u*g+l*w+b*M,e[2]=_*g+h*w+y*M,e[3]=c*g+m*w+v*M,e[4]=s*k+f*z+d*A,e[5]=u*k+l*z+b*A,e[6]=_*k+h*z+y*A,e[7]=c*k+m*z+v*A,e[8]=s*x+f*L+d*E,e[9]=u*x+l*L+b*E,e[10]=_*x+h*L+y*E,e[11]=c*x+m*L+v*E,t!==e&&(e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15]),e)}function _t(e,t,r){var n=Math.sin(r),a=Math.cos(r),i=t[4],o=t[5],s=t[6],u=t[7],_=t[8],c=t[9],f=t[10],l=t[11];return t!==e&&(e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15]),e[4]=i*a+_*n,e[5]=o*a+c*n,e[6]=s*a+f*n,e[7]=u*a+l*n,e[8]=_*a-i*n,e[9]=c*a-o*n,e[10]=f*a-s*n,e[11]=l*a-u*n,e}function ct(e,t,r){var n=Math.sin(r),a=Math.cos(r),i=t[0],o=t[1],s=t[2],u=t[3],_=t[8],c=t[9],f=t[10],l=t[11];return t!==e&&(e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15]),e[0]=i*a-_*n,e[1]=o*a-c*n,e[2]=s*a-f*n,e[3]=u*a-l*n,e[8]=i*n+_*a,e[9]=o*n+c*a,e[10]=s*n+f*a,e[11]=u*n+l*a,e}function ft(e,t,r){var n=Math.sin(r),a=Math.cos(r),i=t[0],o=t[1],s=t[2],u=t[3],_=t[4],c=t[5],f=t[6],l=t[7];return t!==e&&(e[8]=t[8],e[9]=t[9],e[10]=t[10],e[11]=t[11],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15]),e[0]=i*a+_*n,e[1]=o*a+c*n,e[2]=s*a+f*n,e[3]=u*a+l*n,e[4]=_*a-i*n,e[5]=c*a-o*n,e[6]=f*a-s*n,e[7]=l*a-u*n,e}function lt(e,t){return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=1,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=1,e[11]=0,e[12]=t[0],e[13]=t[1],e[14]=t[2],e[15]=1,e}function pt(e,t){return e[0]=t[0],e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=t[1],e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=t[2],e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function ht(e,t,r){var n,a,i,o=r[0],s=r[1],u=r[2],_=Math.hypot(o,s,u);return _<p?null:(o*=_=1/_,s*=_,u*=_,n=Math.sin(t),i=1-(a=Math.cos(t)),e[0]=o*o*i+a,e[1]=s*o*i+u*n,e[2]=u*o*i-s*n,e[3]=0,e[4]=o*s*i-u*n,e[5]=s*s*i+a,e[6]=u*s*i+o*n,e[7]=0,e[8]=o*u*i+s*n,e[9]=s*u*i-o*n,e[10]=u*u*i+a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e)}function mt(e,t){var r=Math.sin(t),n=Math.cos(t);return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=n,e[6]=r,e[7]=0,e[8]=0,e[9]=-r,e[10]=n,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function dt(e,t){var r=Math.sin(t),n=Math.cos(t);return e[0]=n,e[1]=0,e[2]=-r,e[3]=0,e[4]=0,e[5]=1,e[6]=0,e[7]=0,e[8]=r,e[9]=0,e[10]=n,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function bt(e,t){var r=Math.sin(t),n=Math.cos(t);return e[0]=n,e[1]=r,e[2]=0,e[3]=0,e[4]=-r,e[5]=n,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=1,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function yt(e,t,r){var n=t[0],a=t[1],i=t[2],o=t[3],s=n+n,u=a+a,_=i+i,c=n*s,f=n*u,l=n*_,p=a*u,h=a*_,m=i*_,d=o*s,b=o*u,y=o*_;return e[0]=1-(p+m),e[1]=f+y,e[2]=l-b,e[3]=0,e[4]=f-y,e[5]=1-(c+m),e[6]=h+d,e[7]=0,e[8]=l+b,e[9]=h-d,e[10]=1-(c+p),e[11]=0,e[12]=r[0],e[13]=r[1],e[14]=r[2],e[15]=1,e}function vt(e,t){var r=new h(3),n=-t[0],a=-t[1],i=-t[2],o=t[3],s=t[4],u=t[5],_=t[6],c=t[7],f=n*n+a*a+i*i+o*o;return f>0?(r[0]=2*(s*o+c*n+u*i-_*a)/f,r[1]=2*(u*o+c*a+_*n-s*i)/f,r[2]=2*(_*o+c*i+s*a-u*n)/f):(r[0]=2*(s*o+c*n+u*i-_*a),r[1]=2*(u*o+c*a+_*n-s*i),r[2]=2*(_*o+c*i+s*a-u*n)),yt(e,t,r),e}function gt(e,t){return e[0]=t[12],e[1]=t[13],e[2]=t[14],e}function wt(e,t){var r=t[0],n=t[1],a=t[2],i=t[4],o=t[5],s=t[6],u=t[8],_=t[9],c=t[10];return e[0]=Math.hypot(r,n,a),e[1]=Math.hypot(i,o,s),e[2]=Math.hypot(u,_,c),e}function Mt(e,t){var r=new h(3);wt(r,t);var n=1/r[0],a=1/r[1],i=1/r[2],o=t[0]*n,s=t[1]*a,u=t[2]*i,_=t[4]*n,c=t[5]*a,f=t[6]*i,l=t[8]*n,p=t[9]*a,m=t[10]*i,d=o+c+m,b=0;return d>0?(b=2*Math.sqrt(d+1),e[3]=.25*b,e[0]=(f-p)/b,e[1]=(l-u)/b,e[2]=(s-_)/b):o>c&&o>m?(b=2*Math.sqrt(1+o-c-m),e[3]=(f-p)/b,e[0]=.25*b,e[1]=(s+_)/b,e[2]=(l+u)/b):c>m?(b=2*Math.sqrt(1+c-o-m),e[3]=(l-u)/b,e[0]=(s+_)/b,e[1]=.25*b,e[2]=(f+p)/b):(b=2*Math.sqrt(1+m-o-c),e[3]=(s-_)/b,e[0]=(l+u)/b,e[1]=(f+p)/b,e[2]=.25*b),e}function kt(e,t,r,n){var a=t[0],i=t[1],o=t[2],s=t[3],u=a+a,_=i+i,c=o+o,f=a*u,l=a*_,p=a*c,h=i*_,m=i*c,d=o*c,b=s*u,y=s*_,v=s*c,g=n[0],w=n[1],M=n[2];return e[0]=(1-(h+d))*g,e[1]=(l+v)*g,e[2]=(p-y)*g,e[3]=0,e[4]=(l-v)*w,e[5]=(1-(f+d))*w,e[6]=(m+b)*w,e[7]=0,e[8]=(p+y)*M,e[9]=(m-b)*M,e[10]=(1-(f+h))*M,e[11]=0,e[12]=r[0],e[13]=r[1],e[14]=r[2],e[15]=1,e}function zt(e,t,r,n,a){var i=t[0],o=t[1],s=t[2],u=t[3],_=i+i,c=o+o,f=s+s,l=i*_,p=i*c,h=i*f,m=o*c,d=o*f,b=s*f,y=u*_,v=u*c,g=u*f,w=n[0],M=n[1],k=n[2],z=a[0],A=a[1],x=a[2],L=(1-(m+b))*w,E=(p+g)*w,C=(h-v)*w,O=(p-g)*M,S=(1-(l+b))*M,T=(d+y)*M,P=(h+v)*k,I=(d-y)*k,B=(1-(l+m))*k;return e[0]=L,e[1]=E,e[2]=C,e[3]=0,e[4]=O,e[5]=S,e[6]=T,e[7]=0,e[8]=P,e[9]=I,e[10]=B,e[11]=0,e[12]=r[0]+z-(L*z+O*A+P*x),e[13]=r[1]+A-(E*z+S*A+I*x),e[14]=r[2]+x-(C*z+T*A+B*x),e[15]=1,e}function At(e,t){var r=t[0],n=t[1],a=t[2],i=t[3],o=r+r,s=n+n,u=a+a,_=r*o,c=n*o,f=n*s,l=a*o,p=a*s,h=a*u,m=i*o,d=i*s,b=i*u;return e[0]=1-f-h,e[1]=c+b,e[2]=l-d,e[3]=0,e[4]=c-b,e[5]=1-_-h,e[6]=p+m,e[7]=0,e[8]=l+d,e[9]=p-m,e[10]=1-_-f,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function xt(e,t,r,n,a,i,o){var s=1/(r-t),u=1/(a-n),_=1/(i-o);return e[0]=2*i*s,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=2*i*u,e[6]=0,e[7]=0,e[8]=(r+t)*s,e[9]=(a+n)*u,e[10]=(o+i)*_,e[11]=-1,e[12]=0,e[13]=0,e[14]=o*i*2*_,e[15]=0,e}function Lt(e,t,r,n,a){var i,o=1/Math.tan(t/2);return e[0]=o/r,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=o,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[11]=-1,e[12]=0,e[13]=0,e[15]=0,null!=a&&a!==1/0?(i=1/(n-a),e[10]=(a+n)*i,e[14]=2*a*n*i):(e[10]=-1,e[14]=-2*n),e}function Et(e,t,r,n){var a=Math.tan(t.upDegrees*Math.PI/180),i=Math.tan(t.downDegrees*Math.PI/180),o=Math.tan(t.leftDegrees*Math.PI/180),s=Math.tan(t.rightDegrees*Math.PI/180),u=2/(o+s),_=2/(a+i);return e[0]=u,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=_,e[6]=0,e[7]=0,e[8]=-(o-s)*u*.5,e[9]=(a-i)*_*.5,e[10]=n/(r-n),e[11]=-1,e[12]=0,e[13]=0,e[14]=n*r/(r-n),e[15]=0,e}function Ct(e,t,r,n,a,i,o){var s=1/(t-r),u=1/(n-a),_=1/(i-o);return e[0]=-2*s,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=-2*u,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=2*_,e[11]=0,e[12]=(t+r)*s,e[13]=(a+n)*u,e[14]=(o+i)*_,e[15]=1,e}function Ot(e,t,r,n){var a,i,o,s,u,_,c,f,l,h,m=t[0],d=t[1],b=t[2],y=n[0],v=n[1],g=n[2],w=r[0],M=r[1],k=r[2];return Math.abs(m-w)<p&&Math.abs(d-M)<p&&Math.abs(b-k)<p?et(e):(c=m-w,f=d-M,l=b-k,a=v*(l*=h=1/Math.hypot(c,f,l))-g*(f*=h),i=g*(c*=h)-y*l,o=y*f-v*c,(h=Math.hypot(a,i,o))?(a*=h=1/h,i*=h,o*=h):(a=0,i=0,o=0),s=f*o-l*i,u=l*a-c*o,_=c*i-f*a,(h=Math.hypot(s,u,_))?(s*=h=1/h,u*=h,_*=h):(s=0,u=0,_=0),e[0]=a,e[1]=s,e[2]=c,e[3]=0,e[4]=i,e[5]=u,e[6]=f,e[7]=0,e[8]=o,e[9]=_,e[10]=l,e[11]=0,e[12]=-(a*m+i*d+o*b),e[13]=-(s*m+u*d+_*b),e[14]=-(c*m+f*d+l*b),e[15]=1,e)}function St(e,t,r,n){var a=t[0],i=t[1],o=t[2],s=n[0],u=n[1],_=n[2],c=a-r[0],f=i-r[1],l=o-r[2],p=c*c+f*f+l*l;p>0&&(c*=p=1/Math.sqrt(p),f*=p,l*=p);var h=u*l-_*f,m=_*c-s*l,d=s*f-u*c;return(p=h*h+m*m+d*d)>0&&(h*=p=1/Math.sqrt(p),m*=p,d*=p),e[0]=h,e[1]=m,e[2]=d,e[3]=0,e[4]=f*d-l*m,e[5]=l*h-c*d,e[6]=c*m-f*h,e[7]=0,e[8]=c,e[9]=f,e[10]=l,e[11]=0,e[12]=a,e[13]=i,e[14]=o,e[15]=1,e}function Tt(e){return"mat4("+e[0]+", "+e[1]+", "+e[2]+", "+e[3]+", "+e[4]+", "+e[5]+", "+e[6]+", "+e[7]+", "+e[8]+", "+e[9]+", "+e[10]+", "+e[11]+", "+e[12]+", "+e[13]+", "+e[14]+", "+e[15]+")"}function Pt(e){return Math.hypot(e[0],e[1],e[3],e[4],e[5],e[6],e[7],e[8],e[9],e[10],e[11],e[12],e[13],e[14],e[15])}function It(e,t,r){return e[0]=t[0]+r[0],e[1]=t[1]+r[1],e[2]=t[2]+r[2],e[3]=t[3]+r[3],e[4]=t[4]+r[4],e[5]=t[5]+r[5],e[6]=t[6]+r[6],e[7]=t[7]+r[7],e[8]=t[8]+r[8],e[9]=t[9]+r[9],e[10]=t[10]+r[10],e[11]=t[11]+r[11],e[12]=t[12]+r[12],e[13]=t[13]+r[13],e[14]=t[14]+r[14],e[15]=t[15]+r[15],e}function Bt(e,t,r){return e[0]=t[0]-r[0],e[1]=t[1]-r[1],e[2]=t[2]-r[2],e[3]=t[3]-r[3],e[4]=t[4]-r[4],e[5]=t[5]-r[5],e[6]=t[6]-r[6],e[7]=t[7]-r[7],e[8]=t[8]-r[8],e[9]=t[9]-r[9],e[10]=t[10]-r[10],e[11]=t[11]-r[11],e[12]=t[12]-r[12],e[13]=t[13]-r[13],e[14]=t[14]-r[14],e[15]=t[15]-r[15],e}function Ft(e,t,r){return e[0]=t[0]*r,e[1]=t[1]*r,e[2]=t[2]*r,e[3]=t[3]*r,e[4]=t[4]*r,e[5]=t[5]*r,e[6]=t[6]*r,e[7]=t[7]*r,e[8]=t[8]*r,e[9]=t[9]*r,e[10]=t[10]*r,e[11]=t[11]*r,e[12]=t[12]*r,e[13]=t[13]*r,e[14]=t[14]*r,e[15]=t[15]*r,e}function Dt(e,t,r,n){return e[0]=t[0]+r[0]*n,e[1]=t[1]+r[1]*n,e[2]=t[2]+r[2]*n,e[3]=t[3]+r[3]*n,e[4]=t[4]+r[4]*n,e[5]=t[5]+r[5]*n,e[6]=t[6]+r[6]*n,e[7]=t[7]+r[7]*n,e[8]=t[8]+r[8]*n,e[9]=t[9]+r[9]*n,e[10]=t[10]+r[10]*n,e[11]=t[11]+r[11]*n,e[12]=t[12]+r[12]*n,e[13]=t[13]+r[13]*n,e[14]=t[14]+r[14]*n,e[15]=t[15]+r[15]*n,e}function jt(e,t){return e[0]===t[0]&&e[1]===t[1]&&e[2]===t[2]&&e[3]===t[3]&&e[4]===t[4]&&e[5]===t[5]&&e[6]===t[6]&&e[7]===t[7]&&e[8]===t[8]&&e[9]===t[9]&&e[10]===t[10]&&e[11]===t[11]&&e[12]===t[12]&&e[13]===t[13]&&e[14]===t[14]&&e[15]===t[15]}function Rt(e,t){var r=e[0],n=e[1],a=e[2],i=e[3],o=e[4],s=e[5],u=e[6],_=e[7],c=e[8],f=e[9],l=e[10],h=e[11],m=e[12],d=e[13],b=e[14],y=e[15],v=t[0],g=t[1],w=t[2],M=t[3],k=t[4],z=t[5],A=t[6],x=t[7],L=t[8],E=t[9],C=t[10],O=t[11],S=t[12],T=t[13],P=t[14],I=t[15];return Math.abs(r-v)<=p*Math.max(1,Math.abs(r),Math.abs(v))&&Math.abs(n-g)<=p*Math.max(1,Math.abs(n),Math.abs(g))&&Math.abs(a-w)<=p*Math.max(1,Math.abs(a),Math.abs(w))&&Math.abs(i-M)<=p*Math.max(1,Math.abs(i),Math.abs(M))&&Math.abs(o-k)<=p*Math.max(1,Math.abs(o),Math.abs(k))&&Math.abs(s-z)<=p*Math.max(1,Math.abs(s),Math.abs(z))&&Math.abs(u-A)<=p*Math.max(1,Math.abs(u),Math.abs(A))&&Math.abs(_-x)<=p*Math.max(1,Math.abs(_),Math.abs(x))&&Math.abs(c-L)<=p*Math.max(1,Math.abs(c),Math.abs(L))&&Math.abs(f-E)<=p*Math.max(1,Math.abs(f),Math.abs(E))&&Math.abs(l-C)<=p*Math.max(1,Math.abs(l),Math.abs(C))&&Math.abs(h-O)<=p*Math.max(1,Math.abs(h),Math.abs(O))&&Math.abs(m-S)<=p*Math.max(1,Math.abs(m),Math.abs(S))&&Math.abs(d-T)<=p*Math.max(1,Math.abs(d),Math.abs(T))&&Math.abs(b-P)<=p*Math.max(1,Math.abs(b),Math.abs(P))&&Math.abs(y-I)<=p*Math.max(1,Math.abs(y),Math.abs(I))}var Vt=it,qt=Bt;function Gt(){var e=new h(3);return h!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0),e}function Nt(e){var t=new h(3);return t[0]=e[0],t[1]=e[1],t[2]=e[2],t}function Ut(e){var t=e[0],r=e[1],n=e[2];return Math.hypot(t,r,n)}function Wt(e,t,r){var n=new h(3);return n[0]=e,n[1]=t,n[2]=r,n}function Ht(e,t){return e[0]=t[0],e[1]=t[1],e[2]=t[2],e}function Zt(e,t,r,n){return e[0]=t,e[1]=r,e[2]=n,e}function Yt(e,t,r){return e[0]=t[0]+r[0],e[1]=t[1]+r[1],e[2]=t[2]+r[2],e}function Xt(e,t,r){return e[0]=t[0]-r[0],e[1]=t[1]-r[1],e[2]=t[2]-r[2],e}function Kt(e,t,r){return e[0]=t[0]*r[0],e[1]=t[1]*r[1],e[2]=t[2]*r[2],e}function Jt(e,t,r){return e[0]=t[0]/r[0],e[1]=t[1]/r[1],e[2]=t[2]/r[2],e}function Qt(e,t){return e[0]=Math.ceil(t[0]),e[1]=Math.ceil(t[1]),e[2]=Math.ceil(t[2]),e}function $t(e,t){return e[0]=Math.floor(t[0]),e[1]=Math.floor(t[1]),e[2]=Math.floor(t[2]),e}function er(e,t,r){return e[0]=Math.min(t[0],r[0]),e[1]=Math.min(t[1],r[1]),e[2]=Math.min(t[2],r[2]),e}function tr(e,t,r){return e[0]=Math.max(t[0],r[0]),e[1]=Math.max(t[1],r[1]),e[2]=Math.max(t[2],r[2]),e}function rr(e,t){return e[0]=Math.round(t[0]),e[1]=Math.round(t[1]),e[2]=Math.round(t[2]),e}function nr(e,t,r){return e[0]=t[0]*r,e[1]=t[1]*r,e[2]=t[2]*r,e}function ar(e,t,r,n){return e[0]=t[0]+r[0]*n,e[1]=t[1]+r[1]*n,e[2]=t[2]+r[2]*n,e}function ir(e,t){var r=t[0]-e[0],n=t[1]-e[1],a=t[2]-e[2];return Math.hypot(r,n,a)}function or(e,t){var r=t[0]-e[0],n=t[1]-e[1],a=t[2]-e[2];return r*r+n*n+a*a}function sr(e){var t=e[0],r=e[1],n=e[2];return t*t+r*r+n*n}function ur(e,t){return e[0]=-t[0],e[1]=-t[1],e[2]=-t[2],e}function _r(e,t){return e[0]=1/t[0],e[1]=1/t[1],e[2]=1/t[2],e}function cr(e,t){var r=t[0],n=t[1],a=t[2],i=r*r+n*n+a*a;return i>0&&(i=1/Math.sqrt(i)),e[0]=t[0]*i,e[1]=t[1]*i,e[2]=t[2]*i,e}function fr(e,t){return e[0]*t[0]+e[1]*t[1]+e[2]*t[2]}function lr(e,t,r){var n=t[0],a=t[1],i=t[2],o=r[0],s=r[1],u=r[2];return e[0]=a*u-i*s,e[1]=i*o-n*u,e[2]=n*s-a*o,e}function pr(e,t,r,n){var a=t[0],i=t[1],o=t[2];return e[0]=a+n*(r[0]-a),e[1]=i+n*(r[1]-i),e[2]=o+n*(r[2]-o),e}function hr(e,t,r,n,a,i){var o=i*i,s=o*(2*i-3)+1,u=o*(i-2)+i,_=o*(i-1),c=o*(3-2*i);return e[0]=t[0]*s+r[0]*u+n[0]*_+a[0]*c,e[1]=t[1]*s+r[1]*u+n[1]*_+a[1]*c,e[2]=t[2]*s+r[2]*u+n[2]*_+a[2]*c,e}function mr(e,t,r,n,a,i){var o=1-i,s=o*o,u=i*i,_=s*o,c=3*i*s,f=3*u*o,l=u*i;return e[0]=t[0]*_+r[0]*c+n[0]*f+a[0]*l,e[1]=t[1]*_+r[1]*c+n[1]*f+a[1]*l,e[2]=t[2]*_+r[2]*c+n[2]*f+a[2]*l,e}function dr(e,t){t=t||1;var r=2*m()*Math.PI,n=2*m()-1,a=Math.sqrt(1-n*n)*t;return e[0]=Math.cos(r)*a,e[1]=Math.sin(r)*a,e[2]=n*t,e}function br(e,t,r){var n=t[0],a=t[1],i=t[2],o=r[3]*n+r[7]*a+r[11]*i+r[15];return o=o||1,e[0]=(r[0]*n+r[4]*a+r[8]*i+r[12])/o,e[1]=(r[1]*n+r[5]*a+r[9]*i+r[13])/o,e[2]=(r[2]*n+r[6]*a+r[10]*i+r[14])/o,e}function yr(e,t,r){var n=t[0],a=t[1],i=t[2];return e[0]=n*r[0]+a*r[3]+i*r[6],e[1]=n*r[1]+a*r[4]+i*r[7],e[2]=n*r[2]+a*r[5]+i*r[8],e}function vr(e,t,r){var n=r[0],a=r[1],i=r[2],o=r[3],s=t[0],u=t[1],_=t[2],c=a*_-i*u,f=i*s-n*_,l=n*u-a*s,p=a*l-i*f,h=i*c-n*l,m=n*f-a*c,d=2*o;return c*=d,f*=d,l*=d,p*=2,h*=2,m*=2,e[0]=s+c+p,e[1]=u+f+h,e[2]=_+l+m,e}function gr(e,t,r,n){var a=[],i=[];return a[0]=t[0]-r[0],a[1]=t[1]-r[1],a[2]=t[2]-r[2],i[0]=a[0],i[1]=a[1]*Math.cos(n)-a[2]*Math.sin(n),i[2]=a[1]*Math.sin(n)+a[2]*Math.cos(n),e[0]=i[0]+r[0],e[1]=i[1]+r[1],e[2]=i[2]+r[2],e}function wr(e,t,r,n){var a=[],i=[];return a[0]=t[0]-r[0],a[1]=t[1]-r[1],a[2]=t[2]-r[2],i[0]=a[2]*Math.sin(n)+a[0]*Math.cos(n),i[1]=a[1],i[2]=a[2]*Math.cos(n)-a[0]*Math.sin(n),e[0]=i[0]+r[0],e[1]=i[1]+r[1],e[2]=i[2]+r[2],e}function Mr(e,t,r,n){var a=[],i=[];return a[0]=t[0]-r[0],a[1]=t[1]-r[1],a[2]=t[2]-r[2],i[0]=a[0]*Math.cos(n)-a[1]*Math.sin(n),i[1]=a[0]*Math.sin(n)+a[1]*Math.cos(n),i[2]=a[2],e[0]=i[0]+r[0],e[1]=i[1]+r[1],e[2]=i[2]+r[2],e}function kr(e,t){var r=Wt(e[0],e[1],e[2]),n=Wt(t[0],t[1],t[2]);cr(r,r),cr(n,n);var a=fr(r,n);return a>1?0:a<-1?Math.PI:Math.acos(a)}function zr(e){return e[0]=0,e[1]=0,e[2]=0,e}function Ar(e){return"vec3("+e[0]+", "+e[1]+", "+e[2]+")"}function xr(e,t){return e[0]===t[0]&&e[1]===t[1]&&e[2]===t[2]}function Lr(e,t){var r=e[0],n=e[1],a=e[2],i=t[0],o=t[1],s=t[2];return Math.abs(r-i)<=p*Math.max(1,Math.abs(r),Math.abs(i))&&Math.abs(n-o)<=p*Math.max(1,Math.abs(n),Math.abs(o))&&Math.abs(a-s)<=p*Math.max(1,Math.abs(a),Math.abs(s))}var Er,Cr=Xt,Or=Kt,Sr=Jt,Tr=ir,Pr=or,Ir=Ut,Br=sr,Fr=(Er=Gt(),function(e,t,r,n,a,i){var o,s;for(t||(t=3),r||(r=0),s=n?Math.min(n*t+r,e.length):e.length,o=r;o<s;o+=t)Er[0]=e[o],Er[1]=e[o+1],Er[2]=e[o+2],a(Er,Er,i),e[o]=Er[0],e[o+1]=Er[1],e[o+2]=Er[2];return e});function Dr(){var e=new h(4);return h!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0,e[3]=0),e}function jr(e){var t=new h(4);return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t}function Rr(e,t,r,n){var a=new h(4);return a[0]=e,a[1]=t,a[2]=r,a[3]=n,a}function Vr(e,t){return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e}function qr(e,t,r,n,a){return e[0]=t,e[1]=r,e[2]=n,e[3]=a,e}function Gr(e,t,r){return e[0]=t[0]+r[0],e[1]=t[1]+r[1],e[2]=t[2]+r[2],e[3]=t[3]+r[3],e}function Nr(e,t,r){return e[0]=t[0]-r[0],e[1]=t[1]-r[1],e[2]=t[2]-r[2],e[3]=t[3]-r[3],e}function Ur(e,t,r){return e[0]=t[0]*r[0],e[1]=t[1]*r[1],e[2]=t[2]*r[2],e[3]=t[3]*r[3],e}function Wr(e,t,r){return e[0]=t[0]/r[0],e[1]=t[1]/r[1],e[2]=t[2]/r[2],e[3]=t[3]/r[3],e}function Hr(e,t){return e[0]=Math.ceil(t[0]),e[1]=Math.ceil(t[1]),e[2]=Math.ceil(t[2]),e[3]=Math.ceil(t[3]),e}function Zr(e,t){return e[0]=Math.floor(t[0]),e[1]=Math.floor(t[1]),e[2]=Math.floor(t[2]),e[3]=Math.floor(t[3]),e}function Yr(e,t,r){return e[0]=Math.min(t[0],r[0]),e[1]=Math.min(t[1],r[1]),e[2]=Math.min(t[2],r[2]),e[3]=Math.min(t[3],r[3]),e}function Xr(e,t,r){return e[0]=Math.max(t[0],r[0]),e[1]=Math.max(t[1],r[1]),e[2]=Math.max(t[2],r[2]),e[3]=Math.max(t[3],r[3]),e}function Kr(e,t){return e[0]=Math.round(t[0]),e[1]=Math.round(t[1]),e[2]=Math.round(t[2]),e[3]=Math.round(t[3]),e}function Jr(e,t,r){return e[0]=t[0]*r,e[1]=t[1]*r,e[2]=t[2]*r,e[3]=t[3]*r,e}function Qr(e,t,r,n){return e[0]=t[0]+r[0]*n,e[1]=t[1]+r[1]*n,e[2]=t[2]+r[2]*n,e[3]=t[3]+r[3]*n,e}function $r(e,t){var r=t[0]-e[0],n=t[1]-e[1],a=t[2]-e[2],i=t[3]-e[3];return Math.hypot(r,n,a,i)}function en(e,t){var r=t[0]-e[0],n=t[1]-e[1],a=t[2]-e[2],i=t[3]-e[3];return r*r+n*n+a*a+i*i}function tn(e){var t=e[0],r=e[1],n=e[2],a=e[3];return Math.hypot(t,r,n,a)}function rn(e){var t=e[0],r=e[1],n=e[2],a=e[3];return t*t+r*r+n*n+a*a}function nn(e,t){return e[0]=-t[0],e[1]=-t[1],e[2]=-t[2],e[3]=-t[3],e}function an(e,t){return e[0]=1/t[0],e[1]=1/t[1],e[2]=1/t[2],e[3]=1/t[3],e}function on(e,t){var r=t[0],n=t[1],a=t[2],i=t[3],o=r*r+n*n+a*a+i*i;return o>0&&(o=1/Math.sqrt(o)),e[0]=r*o,e[1]=n*o,e[2]=a*o,e[3]=i*o,e}function sn(e,t){return e[0]*t[0]+e[1]*t[1]+e[2]*t[2]+e[3]*t[3]}function un(e,t,r,n){var a=r[0]*n[1]-r[1]*n[0],i=r[0]*n[2]-r[2]*n[0],o=r[0]*n[3]-r[3]*n[0],s=r[1]*n[2]-r[2]*n[1],u=r[1]*n[3]-r[3]*n[1],_=r[2]*n[3]-r[3]*n[2],c=t[0],f=t[1],l=t[2],p=t[3];return e[0]=f*_-l*u+p*s,e[1]=-c*_+l*o-p*i,e[2]=c*u-f*o+p*a,e[3]=-c*s+f*i-l*a,e}function _n(e,t,r,n){var a=t[0],i=t[1],o=t[2],s=t[3];return e[0]=a+n*(r[0]-a),e[1]=i+n*(r[1]-i),e[2]=o+n*(r[2]-o),e[3]=s+n*(r[3]-s),e}function cn(e,t){var r,n,a,i,o,s;t=t||1;do{o=(r=2*m()-1)*r+(n=2*m()-1)*n}while(o>=1);do{s=(a=2*m()-1)*a+(i=2*m()-1)*i}while(s>=1);var u=Math.sqrt((1-o)/s);return e[0]=t*r,e[1]=t*n,e[2]=t*a*u,e[3]=t*i*u,e}function fn(e,t,r){var n=t[0],a=t[1],i=t[2],o=t[3];return e[0]=r[0]*n+r[4]*a+r[8]*i+r[12]*o,e[1]=r[1]*n+r[5]*a+r[9]*i+r[13]*o,e[2]=r[2]*n+r[6]*a+r[10]*i+r[14]*o,e[3]=r[3]*n+r[7]*a+r[11]*i+r[15]*o,e}function ln(e,t,r){var n=t[0],a=t[1],i=t[2],o=r[0],s=r[1],u=r[2],_=r[3],c=_*n+s*i-u*a,f=_*a+u*n-o*i,l=_*i+o*a-s*n,p=-o*n-s*a-u*i;return e[0]=c*_+p*-o+f*-u-l*-s,e[1]=f*_+p*-s+l*-o-c*-u,e[2]=l*_+p*-u+c*-s-f*-o,e[3]=t[3],e}function pn(e){return e[0]=0,e[1]=0,e[2]=0,e[3]=0,e}function hn(e){return"vec4("+e[0]+", "+e[1]+", "+e[2]+", "+e[3]+")"}function mn(e,t){return e[0]===t[0]&&e[1]===t[1]&&e[2]===t[2]&&e[3]===t[3]}function dn(e,t){var r=e[0],n=e[1],a=e[2],i=e[3],o=t[0],s=t[1],u=t[2],_=t[3];return Math.abs(r-o)<=p*Math.max(1,Math.abs(r),Math.abs(o))&&Math.abs(n-s)<=p*Math.max(1,Math.abs(n),Math.abs(s))&&Math.abs(a-u)<=p*Math.max(1,Math.abs(a),Math.abs(u))&&Math.abs(i-_)<=p*Math.max(1,Math.abs(i),Math.abs(_))}var bn=Nr,yn=Ur,vn=Wr,gn=$r,wn=en,Mn=tn,kn=rn,zn=function(){var e=Dr();return function(t,r,n,a,i,o){var s,u;for(r||(r=4),n||(n=0),u=a?Math.min(a*r+n,t.length):t.length,s=n;s<u;s+=r)e[0]=t[s],e[1]=t[s+1],e[2]=t[s+2],e[3]=t[s+3],i(e,e,o),t[s]=e[0],t[s+1]=e[1],t[s+2]=e[2],t[s+3]=e[3];return t}}();function An(){var e=new h(4);return h!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0),e[3]=1,e}function xn(e){return e[0]=0,e[1]=0,e[2]=0,e[3]=1,e}function Ln(e,t,r){r*=.5;var n=Math.sin(r);return e[0]=n*t[0],e[1]=n*t[1],e[2]=n*t[2],e[3]=Math.cos(r),e}function En(e,t){var r=2*Math.acos(t[3]),n=Math.sin(r/2);return n>p?(e[0]=t[0]/n,e[1]=t[1]/n,e[2]=t[2]/n):(e[0]=1,e[1]=0,e[2]=0),r}function Cn(e,t){var r=aa(e,t);return Math.acos(2*r*r-1)}function On(e,t,r){var n=t[0],a=t[1],i=t[2],o=t[3],s=r[0],u=r[1],_=r[2],c=r[3];return e[0]=n*c+o*s+a*_-i*u,e[1]=a*c+o*u+i*s-n*_,e[2]=i*c+o*_+n*u-a*s,e[3]=o*c-n*s-a*u-i*_,e}function Sn(e,t,r){r*=.5;var n=t[0],a=t[1],i=t[2],o=t[3],s=Math.sin(r),u=Math.cos(r);return e[0]=n*u+o*s,e[1]=a*u+i*s,e[2]=i*u-a*s,e[3]=o*u-n*s,e}function Tn(e,t,r){r*=.5;var n=t[0],a=t[1],i=t[2],o=t[3],s=Math.sin(r),u=Math.cos(r);return e[0]=n*u-i*s,e[1]=a*u+o*s,e[2]=i*u+n*s,e[3]=o*u-a*s,e}function Pn(e,t,r){r*=.5;var n=t[0],a=t[1],i=t[2],o=t[3],s=Math.sin(r),u=Math.cos(r);return e[0]=n*u+a*s,e[1]=a*u-n*s,e[2]=i*u+o*s,e[3]=o*u-i*s,e}function In(e,t){var r=t[0],n=t[1],a=t[2];return e[0]=r,e[1]=n,e[2]=a,e[3]=Math.sqrt(Math.abs(1-r*r-n*n-a*a)),e}function Bn(e,t){var r=t[0],n=t[1],a=t[2],i=t[3],o=Math.sqrt(r*r+n*n+a*a),s=Math.exp(i),u=o>0?s*Math.sin(o)/o:0;return e[0]=r*u,e[1]=n*u,e[2]=a*u,e[3]=s*Math.cos(o),e}function Fn(e,t){var r=t[0],n=t[1],a=t[2],i=t[3],o=Math.sqrt(r*r+n*n+a*a),s=o>0?Math.atan2(o,i)/o:0;return e[0]=r*s,e[1]=n*s,e[2]=a*s,e[3]=.5*Math.log(r*r+n*n+a*a+i*i),e}function Dn(e,t,r){return Fn(e,t),na(e,e,r),Bn(e,e),e}function jn(e,t,r,n){var a,i,o,s,u,_=t[0],c=t[1],f=t[2],l=t[3],h=r[0],m=r[1],d=r[2],b=r[3];return(i=_*h+c*m+f*d+l*b)<0&&(i=-i,h=-h,m=-m,d=-d,b=-b),1-i>p?(a=Math.acos(i),o=Math.sin(a),s=Math.sin((1-n)*a)/o,u=Math.sin(n*a)/o):(s=1-n,u=n),e[0]=s*_+u*h,e[1]=s*c+u*m,e[2]=s*f+u*d,e[3]=s*l+u*b,e}function Rn(e){var t=m(),r=m(),n=m(),a=Math.sqrt(1-t),i=Math.sqrt(t);return e[0]=a*Math.sin(2*Math.PI*r),e[1]=a*Math.cos(2*Math.PI*r),e[2]=i*Math.sin(2*Math.PI*n),e[3]=i*Math.cos(2*Math.PI*n),e}function Vn(e,t){var r=t[0],n=t[1],a=t[2],i=t[3],o=r*r+n*n+a*a+i*i,s=o?1/o:0;return e[0]=-r*s,e[1]=-n*s,e[2]=-a*s,e[3]=i*s,e}function qn(e,t){return e[0]=-t[0],e[1]=-t[1],e[2]=-t[2],e[3]=t[3],e}function Gn(e,t){var r,n=t[0]+t[4]+t[8];if(n>0)r=Math.sqrt(n+1),e[3]=.5*r,r=.5/r,e[0]=(t[5]-t[7])*r,e[1]=(t[6]-t[2])*r,e[2]=(t[1]-t[3])*r;else{var a=0;t[4]>t[0]&&(a=1),t[8]>t[3*a+a]&&(a=2);var i=(a+1)%3,o=(a+2)%3;r=Math.sqrt(t[3*a+a]-t[3*i+i]-t[3*o+o]+1),e[a]=.5*r,r=.5/r,e[3]=(t[3*i+o]-t[3*o+i])*r,e[i]=(t[3*i+a]+t[3*a+i])*r,e[o]=(t[3*o+a]+t[3*a+o])*r}return e}function Nn(e,t,r,n){var a=.5*Math.PI/180;t*=a,r*=a,n*=a;var i=Math.sin(t),o=Math.cos(t),s=Math.sin(r),u=Math.cos(r),_=Math.sin(n),c=Math.cos(n);return e[0]=i*u*c-o*s*_,e[1]=o*s*c+i*u*_,e[2]=o*u*_-i*s*c,e[3]=o*u*c+i*s*_,e}function Un(e){return"quat("+e[0]+", "+e[1]+", "+e[2]+", "+e[3]+")"}var Wn,Hn,Zn,Yn,Xn,Kn,Jn=jr,Qn=Rr,$n=Vr,ea=qr,ta=Gr,ra=On,na=Jr,aa=sn,ia=_n,oa=tn,sa=oa,ua=rn,_a=ua,ca=on,fa=mn,la=dn,pa=(Wn=Gt(),Hn=Wt(1,0,0),Zn=Wt(0,1,0),function(e,t,r){var n=fr(t,r);return n<-.999999?(lr(Wn,Hn,t),Ir(Wn)<1e-6&&lr(Wn,Zn,t),cr(Wn,Wn),Ln(e,Wn,Math.PI),e):n>.999999?(e[0]=0,e[1]=0,e[2]=0,e[3]=1,e):(lr(Wn,t,r),e[0]=Wn[0],e[1]=Wn[1],e[2]=Wn[2],e[3]=1+n,ca(e,e))}),ha=(Yn=An(),Xn=An(),function(e,t,r,n,a,i){return jn(Yn,t,a,i),jn(Xn,r,n,i),jn(e,Yn,Xn,2*i*(1-i)),e}),ma=(Kn=be(),function(e,t,r,n){return Kn[0]=r[0],Kn[3]=r[1],Kn[6]=r[2],Kn[1]=n[0],Kn[4]=n[1],Kn[7]=n[2],Kn[2]=-t[0],Kn[5]=-t[1],Kn[8]=-t[2],ca(e,Gn(e,Kn))});function da(){var e=new h(8);return h!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0,e[4]=0,e[5]=0,e[6]=0,e[7]=0),e[3]=1,e}function ba(e){var t=new h(8);return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t}function ya(e,t,r,n,a,i,o,s){var u=new h(8);return u[0]=e,u[1]=t,u[2]=r,u[3]=n,u[4]=a,u[5]=i,u[6]=o,u[7]=s,u}function va(e,t,r,n,a,i,o){var s=new h(8);s[0]=e,s[1]=t,s[2]=r,s[3]=n;var u=.5*a,_=.5*i,c=.5*o;return s[4]=u*n+_*r-c*t,s[5]=_*n+c*e-u*r,s[6]=c*n+u*t-_*e,s[7]=-u*e-_*t-c*r,s}function ga(e,t,r){var n=.5*r[0],a=.5*r[1],i=.5*r[2],o=t[0],s=t[1],u=t[2],_=t[3];return e[0]=o,e[1]=s,e[2]=u,e[3]=_,e[4]=n*_+a*u-i*s,e[5]=a*_+i*o-n*u,e[6]=i*_+n*s-a*o,e[7]=-n*o-a*s-i*u,e}function wa(e,t){return e[0]=0,e[1]=0,e[2]=0,e[3]=1,e[4]=.5*t[0],e[5]=.5*t[1],e[6]=.5*t[2],e[7]=0,e}function Ma(e,t){return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=0,e[5]=0,e[6]=0,e[7]=0,e}function ka(e,t){var r=An();Mt(r,t);var n=new h(3);return gt(n,t),ga(e,r,n),e}function za(e,t){return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e}function Aa(e){return e[0]=0,e[1]=0,e[2]=0,e[3]=1,e[4]=0,e[5]=0,e[6]=0,e[7]=0,e}function xa(e,t,r,n,a,i,o,s,u){return e[0]=t,e[1]=r,e[2]=n,e[3]=a,e[4]=i,e[5]=o,e[6]=s,e[7]=u,e}var La=$n;function Ea(e,t){return e[0]=t[4],e[1]=t[5],e[2]=t[6],e[3]=t[7],e}var Ca=$n;function Oa(e,t){return e[4]=t[0],e[5]=t[1],e[6]=t[2],e[7]=t[3],e}function Sa(e,t){var r=t[4],n=t[5],a=t[6],i=t[7],o=-t[0],s=-t[1],u=-t[2],_=t[3];return e[0]=2*(r*_+i*o+n*u-a*s),e[1]=2*(n*_+i*s+a*o-r*u),e[2]=2*(a*_+i*u+r*s-n*o),e}function Ta(e,t,r){var n=t[0],a=t[1],i=t[2],o=t[3],s=.5*r[0],u=.5*r[1],_=.5*r[2],c=t[4],f=t[5],l=t[6],p=t[7];return e[0]=n,e[1]=a,e[2]=i,e[3]=o,e[4]=o*s+a*_-i*u+c,e[5]=o*u+i*s-n*_+f,e[6]=o*_+n*u-a*s+l,e[7]=-n*s-a*u-i*_+p,e}function Pa(e,t,r){var n=-t[0],a=-t[1],i=-t[2],o=t[3],s=t[4],u=t[5],_=t[6],c=t[7],f=s*o+c*n+u*i-_*a,l=u*o+c*a+_*n-s*i,p=_*o+c*i+s*a-u*n,h=c*o-s*n-u*a-_*i;return Sn(e,t,r),n=e[0],a=e[1],i=e[2],o=e[3],e[4]=f*o+h*n+l*i-p*a,e[5]=l*o+h*a+p*n-f*i,e[6]=p*o+h*i+f*a-l*n,e[7]=h*o-f*n-l*a-p*i,e}function Ia(e,t,r){var n=-t[0],a=-t[1],i=-t[2],o=t[3],s=t[4],u=t[5],_=t[6],c=t[7],f=s*o+c*n+u*i-_*a,l=u*o+c*a+_*n-s*i,p=_*o+c*i+s*a-u*n,h=c*o-s*n-u*a-_*i;return Tn(e,t,r),n=e[0],a=e[1],i=e[2],o=e[3],e[4]=f*o+h*n+l*i-p*a,e[5]=l*o+h*a+p*n-f*i,e[6]=p*o+h*i+f*a-l*n,e[7]=h*o-f*n-l*a-p*i,e}function Ba(e,t,r){var n=-t[0],a=-t[1],i=-t[2],o=t[3],s=t[4],u=t[5],_=t[6],c=t[7],f=s*o+c*n+u*i-_*a,l=u*o+c*a+_*n-s*i,p=_*o+c*i+s*a-u*n,h=c*o-s*n-u*a-_*i;return Pn(e,t,r),n=e[0],a=e[1],i=e[2],o=e[3],e[4]=f*o+h*n+l*i-p*a,e[5]=l*o+h*a+p*n-f*i,e[6]=p*o+h*i+f*a-l*n,e[7]=h*o-f*n-l*a-p*i,e}function Fa(e,t,r){var n=r[0],a=r[1],i=r[2],o=r[3],s=t[0],u=t[1],_=t[2],c=t[3];return e[0]=s*o+c*n+u*i-_*a,e[1]=u*o+c*a+_*n-s*i,e[2]=_*o+c*i+s*a-u*n,e[3]=c*o-s*n-u*a-_*i,s=t[4],u=t[5],_=t[6],c=t[7],e[4]=s*o+c*n+u*i-_*a,e[5]=u*o+c*a+_*n-s*i,e[6]=_*o+c*i+s*a-u*n,e[7]=c*o-s*n-u*a-_*i,e}function Da(e,t,r){var n=t[0],a=t[1],i=t[2],o=t[3],s=r[0],u=r[1],_=r[2],c=r[3];return e[0]=n*c+o*s+a*_-i*u,e[1]=a*c+o*u+i*s-n*_,e[2]=i*c+o*_+n*u-a*s,e[3]=o*c-n*s-a*u-i*_,s=r[4],u=r[5],_=r[6],c=r[7],e[4]=n*c+o*s+a*_-i*u,e[5]=a*c+o*u+i*s-n*_,e[6]=i*c+o*_+n*u-a*s,e[7]=o*c-n*s-a*u-i*_,e}function ja(e,t,r,n){if(Math.abs(n)<p)return za(e,t);var a=Math.hypot(r[0],r[1],r[2]);n*=.5;var i=Math.sin(n),o=i*r[0]/a,s=i*r[1]/a,u=i*r[2]/a,_=Math.cos(n),c=t[0],f=t[1],l=t[2],h=t[3];e[0]=c*_+h*o+f*u-l*s,e[1]=f*_+h*s+l*o-c*u,e[2]=l*_+h*u+c*s-f*o,e[3]=h*_-c*o-f*s-l*u;var m=t[4],d=t[5],b=t[6],y=t[7];return e[4]=m*_+y*o+d*u-b*s,e[5]=d*_+y*s+b*o-m*u,e[6]=b*_+y*u+m*s-d*o,e[7]=y*_-m*o-d*s-b*u,e}function Ra(e,t,r){return e[0]=t[0]+r[0],e[1]=t[1]+r[1],e[2]=t[2]+r[2],e[3]=t[3]+r[3],e[4]=t[4]+r[4],e[5]=t[5]+r[5],e[6]=t[6]+r[6],e[7]=t[7]+r[7],e}function Va(e,t,r){var n=t[0],a=t[1],i=t[2],o=t[3],s=r[4],u=r[5],_=r[6],c=r[7],f=t[4],l=t[5],p=t[6],h=t[7],m=r[0],d=r[1],b=r[2],y=r[3];return e[0]=n*y+o*m+a*b-i*d,e[1]=a*y+o*d+i*m-n*b,e[2]=i*y+o*b+n*d-a*m,e[3]=o*y-n*m-a*d-i*b,e[4]=n*c+o*s+a*_-i*u+f*y+h*m+l*b-p*d,e[5]=a*c+o*u+i*s-n*_+l*y+h*d+p*m-f*b,e[6]=i*c+o*_+n*u-a*s+p*y+h*b+f*d-l*m,e[7]=o*c-n*s-a*u-i*_+h*y-f*m-l*d-p*b,e}var qa=Va;function Ga(e,t,r){return e[0]=t[0]*r,e[1]=t[1]*r,e[2]=t[2]*r,e[3]=t[3]*r,e[4]=t[4]*r,e[5]=t[5]*r,e[6]=t[6]*r,e[7]=t[7]*r,e}var Na=aa;function Ua(e,t,r,n){var a=1-n;return Na(t,r)<0&&(n=-n),e[0]=t[0]*a+r[0]*n,e[1]=t[1]*a+r[1]*n,e[2]=t[2]*a+r[2]*n,e[3]=t[3]*a+r[3]*n,e[4]=t[4]*a+r[4]*n,e[5]=t[5]*a+r[5]*n,e[6]=t[6]*a+r[6]*n,e[7]=t[7]*a+r[7]*n,e}function Wa(e,t){var r=Xa(t);return e[0]=-t[0]/r,e[1]=-t[1]/r,e[2]=-t[2]/r,e[3]=t[3]/r,e[4]=-t[4]/r,e[5]=-t[5]/r,e[6]=-t[6]/r,e[7]=t[7]/r,e}function Ha(e,t){return e[0]=-t[0],e[1]=-t[1],e[2]=-t[2],e[3]=t[3],e[4]=-t[4],e[5]=-t[5],e[6]=-t[6],e[7]=t[7],e}var Za=oa,Ya=Za,Xa=ua,Ka=Xa;function Ja(e,t){var r=Xa(t);if(r>0){r=Math.sqrt(r);var n=t[0]/r,a=t[1]/r,i=t[2]/r,o=t[3]/r,s=t[4],u=t[5],_=t[6],c=t[7],f=n*s+a*u+i*_+o*c;e[0]=n,e[1]=a,e[2]=i,e[3]=o,e[4]=(s-n*f)/r,e[5]=(u-a*f)/r,e[6]=(_-i*f)/r,e[7]=(c-o*f)/r}return e}function Qa(e){return"quat2("+e[0]+", "+e[1]+", "+e[2]+", "+e[3]+", "+e[4]+", "+e[5]+", "+e[6]+", "+e[7]+")"}function $a(e,t){return e[0]===t[0]&&e[1]===t[1]&&e[2]===t[2]&&e[3]===t[3]&&e[4]===t[4]&&e[5]===t[5]&&e[6]===t[6]&&e[7]===t[7]}function ei(e,t){var r=e[0],n=e[1],a=e[2],i=e[3],o=e[4],s=e[5],u=e[6],_=e[7],c=t[0],f=t[1],l=t[2],h=t[3],m=t[4],d=t[5],b=t[6],y=t[7];return Math.abs(r-c)<=p*Math.max(1,Math.abs(r),Math.abs(c))&&Math.abs(n-f)<=p*Math.max(1,Math.abs(n),Math.abs(f))&&Math.abs(a-l)<=p*Math.max(1,Math.abs(a),Math.abs(l))&&Math.abs(i-h)<=p*Math.max(1,Math.abs(i),Math.abs(h))&&Math.abs(o-m)<=p*Math.max(1,Math.abs(o),Math.abs(m))&&Math.abs(s-d)<=p*Math.max(1,Math.abs(s),Math.abs(d))&&Math.abs(u-b)<=p*Math.max(1,Math.abs(u),Math.abs(b))&&Math.abs(_-y)<=p*Math.max(1,Math.abs(_),Math.abs(y))}function ti(){var e=new h(2);return h!=Float32Array&&(e[0]=0,e[1]=0),e}function ri(e){var t=new h(2);return t[0]=e[0],t[1]=e[1],t}function ni(e,t){var r=new h(2);return r[0]=e,r[1]=t,r}function ai(e,t){return e[0]=t[0],e[1]=t[1],e}function ii(e,t,r){return e[0]=t,e[1]=r,e}function oi(e,t,r){return e[0]=t[0]+r[0],e[1]=t[1]+r[1],e}function si(e,t,r){return e[0]=t[0]-r[0],e[1]=t[1]-r[1],e}function ui(e,t,r){return e[0]=t[0]*r[0],e[1]=t[1]*r[1],e}function _i(e,t,r){return e[0]=t[0]/r[0],e[1]=t[1]/r[1],e}function ci(e,t){return e[0]=Math.ceil(t[0]),e[1]=Math.ceil(t[1]),e}function fi(e,t){return e[0]=Math.floor(t[0]),e[1]=Math.floor(t[1]),e}function li(e,t,r){return e[0]=Math.min(t[0],r[0]),e[1]=Math.min(t[1],r[1]),e}function pi(e,t,r){return e[0]=Math.max(t[0],r[0]),e[1]=Math.max(t[1],r[1]),e}function hi(e,t){return e[0]=Math.round(t[0]),e[1]=Math.round(t[1]),e}function mi(e,t,r){return e[0]=t[0]*r,e[1]=t[1]*r,e}function di(e,t,r,n){return e[0]=t[0]+r[0]*n,e[1]=t[1]+r[1]*n,e}function bi(e,t){var r=t[0]-e[0],n=t[1]-e[1];return Math.hypot(r,n)}function yi(e,t){var r=t[0]-e[0],n=t[1]-e[1];return r*r+n*n}function vi(e){var t=e[0],r=e[1];return Math.hypot(t,r)}function gi(e){var t=e[0],r=e[1];return t*t+r*r}function wi(e,t){return e[0]=-t[0],e[1]=-t[1],e}function Mi(e,t){return e[0]=1/t[0],e[1]=1/t[1],e}function ki(e,t){var r=t[0],n=t[1],a=r*r+n*n;return a>0&&(a=1/Math.sqrt(a)),e[0]=t[0]*a,e[1]=t[1]*a,e}function zi(e,t){return e[0]*t[0]+e[1]*t[1]}function Ai(e,t,r){var n=t[0]*r[1]-t[1]*r[0];return e[0]=e[1]=0,e[2]=n,e}function xi(e,t,r,n){var a=t[0],i=t[1];return e[0]=a+n*(r[0]-a),e[1]=i+n*(r[1]-i),e}function Li(e,t){t=t||1;var r=2*m()*Math.PI;return e[0]=Math.cos(r)*t,e[1]=Math.sin(r)*t,e}function Ei(e,t,r){var n=t[0],a=t[1];return e[0]=r[0]*n+r[2]*a,e[1]=r[1]*n+r[3]*a,e}function Ci(e,t,r){var n=t[0],a=t[1];return e[0]=r[0]*n+r[2]*a+r[4],e[1]=r[1]*n+r[3]*a+r[5],e}function Oi(e,t,r){var n=t[0],a=t[1];return e[0]=r[0]*n+r[3]*a+r[6],e[1]=r[1]*n+r[4]*a+r[7],e}function Si(e,t,r){var n=t[0],a=t[1];return e[0]=r[0]*n+r[4]*a+r[12],e[1]=r[1]*n+r[5]*a+r[13],e}function Ti(e,t,r,n){var a=t[0]-r[0],i=t[1]-r[1],o=Math.sin(n),s=Math.cos(n);return e[0]=a*s-i*o+r[0],e[1]=a*o+i*s+r[1],e}function Pi(e,t){var r=e[0],n=e[1],a=t[0],i=t[1],o=r*r+n*n;o>0&&(o=1/Math.sqrt(o));var s=a*a+i*i;s>0&&(s=1/Math.sqrt(s));var u=(r*a+n*i)*o*s;return u>1?0:u<-1?Math.PI:Math.acos(u)}function Ii(e){return e[0]=0,e[1]=0,e}function Bi(e){return"vec2("+e[0]+", "+e[1]+")"}function Fi(e,t){return e[0]===t[0]&&e[1]===t[1]}function Di(e,t){var r=e[0],n=e[1],a=t[0],i=t[1];return Math.abs(r-a)<=p*Math.max(1,Math.abs(r),Math.abs(a))&&Math.abs(n-i)<=p*Math.max(1,Math.abs(n),Math.abs(i))}var ji=vi,Ri=si,Vi=ui,qi=_i,Gi=bi,Ni=yi,Ui=gi,Wi=function(){var e=ti();return function(t,r,n,a,i,o){var s,u;for(r||(r=2),n||(n=0),u=a?Math.min(a*r+n,t.length):t.length,s=n;s<u;s+=r)e[0]=t[s],e[1]=t[s+1],i(e,e,o),t[s]=e[0],t[s+1]=e[1];return t}}()}},t={};function r(n){var a=t[n];if(void 0!==a)return a.exports;var i=t[n]={exports:{}};return e[n].call(i.exports,i,i.exports,r),i.exports}r.d=(e,t)=>{for(var n in t)r.o(t,n)&&!r.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},r.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e;r.g.importScripts&&(e=r.g.location+"");var t=r.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var n=t.getElementsByTagName("script");n.length&&(e=n[n.length-1].src)}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\\?.*$/,"").replace(/\\/[^\\/]+$/,"/"),r.p=e})(),(()=>{const e=r(248),t=self;e.messageManager.onOutgoingMessage.bind((()=>{let r=e.messageManager.getOutgoingMessages();for(let e of r)t.postMessage(e.msg,e.transferables)}));let n=a=>{if(a&&a.data&&"wasm"===a.data.t){let i=location.href.startsWith("blob")?a.data.url:r(740);i.default&&(i=i.default),e.launchWorkerServer(i),t.removeEventListener("message",n)}};t.addEventListener("message",n),t.addEventListener("message",(t=>{e.messageManager.postIncomingMessage(t.data)}))})()})();',
              "Worker",
              void 0,
              r.p + "zappar-aframe.worker.js"
            );
          }
        },
        477: (e) => {
          "use strict";
          e.exports = function (e, t, r, n) {
            var a = self || window;
            try {
              try {
                var i;
                try {
                  i = new a.Blob([e]);
                } catch (t) {
                  (i = new (a.BlobBuilder ||
                    a.WebKitBlobBuilder ||
                    a.MozBlobBuilder ||
                    a.MSBlobBuilder)()).append(e),
                    (i = i.getBlob());
                }
                var s = a.URL || a.webkitURL,
                  o = s.createObjectURL(i),
                  c = new a[t](o, r);
                return s.revokeObjectURL(o), c;
              } catch (n) {
                return new a[t](
                  "data:application/javascript,".concat(encodeURIComponent(e)),
                  r
                );
              }
            } catch (e) {
              if (!n) throw Error("Inline worker is not supported");
              return new a[t](n, r);
            }
          };
        },
        4576: (t) => {
          "use strict";
          t.exports = e;
        },
      },
      r = {};
    function n(e) {
      var a = r[e];
      if (void 0 !== a) return a.exports;
      var i = (r[e] = { exports: {} });
      return t[e].call(i.exports, i, i.exports, n), i.exports;
    }
    (n.n = (e) => {
      var t = e && e.__esModule ? () => e.default : () => e;
      return n.d(t, { a: t }), t;
    }),
      (n.d = (e, t) => {
        for (var r in t)
          n.o(t, r) &&
            !n.o(e, r) &&
            Object.defineProperty(e, r, { enumerable: !0, get: t[r] });
      }),
      (n.g = (function () {
        if ("object" == typeof globalThis) return globalThis;
        try {
          return this || new Function("return this")();
        } catch (e) {
          if ("object" == typeof window) return window;
        }
      })()),
      (n.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t)),
      (n.r = (e) => {
        "undefined" != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
          Object.defineProperty(e, "__esModule", { value: !0 });
      }),
      (() => {
        var e;
        n.g.importScripts && (e = n.g.location + "");
        var t = n.g.document;
        if (!e && t && (t.currentScript && (e = t.currentScript.src), !e)) {
          var r = t.getElementsByTagName("script");
          r.length && (e = r[r.length - 1].src);
        }
        if (!e)
          throw new Error(
            "Automatic publicPath is not supported in this browser"
          );
        (e = e
          .replace(/#.*$/, "")
          .replace(/\?.*$/, "")
          .replace(/\/[^\/]+$/, "/")),
          (n.p = e);
      })();
    var a = {};
    return (
      (() => {
        "use strict";
        var e = a;
        Object.defineProperty(e, "__esModule", { value: !0 }),
          (e.compatibility_ui =
            e.permission_ui =
            e.face_landmark =
            e.head_mask =
            e.face_mesh =
            e.face_tracker =
            e.image_tracker =
            e.instant_tracker =
            e.camera =
              void 0);
        const t = n(3830);
        console.log(`Zappar for A-Frame v${t.VERSION}`);
        const r = n(2334);
        e.camera = r;
        const i = n(5524);
        e.instant_tracker = i;
        const s = n(9978);
        e.image_tracker = s;
        const o = n(6381);
        e.face_tracker = o;
        const c = n(9728);
        e.face_mesh = c;
        const u = n(7613);
        e.head_mask = u;
        const _ = n(2140);
        e.face_landmark = _;
        const l = n(1207);
        e.permission_ui = l;
        const f = n(5143);
        e.compatibility_ui = f;
      })(),
      a
    );
  })();
});
