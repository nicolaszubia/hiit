(function () {
  "use strict";
  if (
    !window.HiitUser ||
    typeof window.HiitUser.isSessionActive !== "function" ||
    !window.HiitUser.isSessionActive()
  ) {
    window.location.replace("auth.html#login");
  }
})();
