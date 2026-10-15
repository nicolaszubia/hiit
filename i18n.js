(function () {
  "use strict";

  var MESSAGES = {
    en: {
      menu_account: "Account menu",
      menu_log_in: "Log in",
      menu_sign_up: "Sign up",
      menu_badges: "Badges",
      menu_saved: "Saved sessions",
      menu_profile: "Profile",
      menu_log_out: "Log out",

      page_title_dashboard: "HIIT · Workout board",
      page_title_badges: "Badges · HIIT",
      page_title_profile: "Profile · HIIT",
      page_title_session: "Session · HIIT",
      page_title_account: "Account · HIIT",
      page_title_not_found: "Not found · HIIT",

      brand_gym_floor: "Gym floor sessions",
      brand_badges: "Badges",
      brand_profile: "Profile",
      brand_account: "Account",

      search_placeholder: "Search by card ID",
      search_aria: "Search by card ID",

      theme_to_dark: "Switch to dark mode",
      theme_to_light: "Switch to light mode",

      header_badges_aria: "Open badges",
      saved_menu_aria: "Saved sessions",
      saved_heading: "Saved sessions",
      saved_empty: "No saved sessions yet. Tap Save session on any session to keep it here.",
      saved_btn_save: "Save session",
      saved_btn_saved: "Saved",
      header_badges_current: "Badges",

      promo_banner_html:
        'New: <strong>Badges</strong> — see the personal records you&rsquo;ve broken and keep beating your best.',
      promo_view_badges: "View badges",
      promo_dismiss: "Dismiss badges announcement",

      dash_heading: "Workout dashboard",
      metrics_heading: "Metrics",
      metrics_collapse: "Collapse Metrics section",
      metrics_expand: "Expand Metrics section",
      heatmap_section_aria: "Completion calendar by day",
      metrics_grid_aria: "Session counts",

      completed_heading: "Completed",
      completed_sub:
        "Sessions where every exercise is marked done. They appear here automatically.",
      completed_empty: "No sessions completed yet.",
      completed_empty_filter: "No completed sessions match that ID.",

      training_heading: "Your training blocks",
      training_sub:
        "Cards are numbered in order (#1, #2, …). Sessions still in progress stay here until every exercise is checked off.",
      training_empty: "All sessions are complete — great work.",
      training_empty_filter: "No active sessions match that ID.",

      carousel_completed_aria: "Completed sessions — scroll horizontally",
      carousel_training_aria: "Active sessions — scroll horizontally, tap a card to open",

      card_open_session: "Open session",
      detail_share_qr_aria: "QR code linking to this workout session",
      detail_share_qr_fail: "QR could not be generated — use the link below.",
      card_badge_complete: "Complete",
      card_badge_mostly: "Mostly done",
      metric_completed_label: "Cards completed",
      metric_remaining_label: "Cards not yet complete",

      detail_not_found: "No workout found for this ID.",
      detail_back_board: "Back to board",
      detail_back_link: "← Workout board",
      modal_close: "Close",
      modal_no_illust: "No reference illustration for this line.",
      detail_notes: "Notes",
      detail_hint:
        "Use the checkbox for each line to mark exercises you completed. Tap the info icon to see a pose reference. Progress saves as you go; tap Save when you want to return to the workout board.",
      detail_exercises: "Exercises",
      detail_workout: "Workout",
      detail_progress: "{done} of {total} exercises marked done.",
      detail_mark_all: "Mark all as done",
      detail_mark_all_aria: "Mark every line in this workout as completed and save progress",
      detail_save: "Save",
      detail_save_aria: "Save and return to workout dashboard",
      detail_view_illust: "View illustration: {name}",

      badges_page_title: "Your badges",
      badges_page_lead:
        "Finish sessions with every exercise checked to log a completion. Locked badges stay phantom until you hit the milestone on this device.",
      badges_summary: "{unlocked} of {total} badges unlocked — keep finishing sessions to light them up.",
      badge_status_unlocked: "Unlocked",
      badge_status_locked: "Locked",

      badge_first_finish_title: "First finish",
      badge_first_finish_desc: "Complete any workout with every exercise checked.",
      badge_triple_threat_title: "Triple threat",
      badge_triple_threat_desc: "Log 3 full session finishes.",
      badge_ten_club_title: "Ten club",
      badge_ten_club_desc: "Log 10 full session finishes.",
      badge_twenty_five_title: "Quarter stack",
      badge_twenty_five_desc: "Log 25 full session finishes.",
      badge_mix_three_title: "Mix it up",
      badge_mix_three_desc: "Finish 3 different sessions (by card).",
      badge_mix_seven_title: "Broad sampler",
      badge_mix_seven_desc: "Finish 7 different sessions.",
      badge_mix_ten_title: "Deck runner",
      badge_mix_ten_desc: "Finish 10 different sessions.",
      badge_week_surge_title: "Week surge",
      badge_week_surge_desc: "Finish 4+ sessions in one calendar week.",
      badge_five_day_spread_title: "Five-day spread",
      badge_five_day_spread_desc: "Train on 5 different calendar days.",
      badge_ten_day_spread_title: "Ten-day habit",
      badge_ten_day_spread_desc: "Train on 10 different calendar days.",

      profile_gate_title: "Sign in required",
      profile_gate_lead: "Log in or create an account to view and edit your profile on this device.",
      profile_log_in: "Log in",
      profile_sign_up_link: "Sign up",
      profile_content_title: "Your profile",
      profile_content_lead: "Update your details. Everything is stored only on this device.",
      profile_first_name: "First name",
      profile_last_name: "Last name",
      profile_age: "Age",
      profile_level: "Level of complexity",
      profile_gender: "Gender",
      profile_country: "Country",
      profile_email: "Email",
      profile_phone: "Phone",
      profile_email_hint: "Email matches your account and cannot be changed here.",
      profile_save: "Save profile",
      profile_select: "Select…",
      profile_gender_female: "Female",
      profile_gender_male: "Male",
      profile_gender_nb: "Non-binary",
      profile_gender_other: "Other",
      profile_gender_prefer_not: "Prefer not to say",
      profile_saved: "Profile saved.",
      profile_err_email: "Please enter a valid email address or leave it blank.",

      auth_login_title: "Log in",
      auth_login_lead: "Use the email and password you signed up with on this device.",
      auth_email: "Email",
      auth_password: "Password",
      auth_confirm_password: "Confirm password",
      auth_login_submit: "Log in",
      auth_need_account: "Need an account?",
      auth_sign_up_btn: "Sign up",
      auth_signup_title: "Sign up",
      auth_signup_lead: "Create a local account. Data stays in this browser only.",
      auth_create_account: "Create account",
      auth_have_account: "Already have an account?",
      auth_login_btn: "Log in",
      auth_forgot_link: "Forgot your password?",
      auth_forgot_title: "Reset password",
      auth_forgot_lead:
        "Accounts are stored only in this browser, so we can't send an email. Enter the email you signed up with and choose a new password.",
      auth_new_password: "New password",
      auth_forgot_submit: "Reset password",
      auth_back_to_login: "Back to log in",
      auth_err_reset_no_account: "No account with that email on this device.",
      auth_err_reset_unexpected: "Could not reset the password. Try again.",
      auth_err_email: "Enter a valid email.",
      auth_err_password: "Enter your password.",
      auth_err_login: "Could not log in.",
      auth_err_login_unexpected:
        "Login failed unexpectedly. Try again, or use an external browser at the same URL.",
      auth_err_password_min: "Password must be at least {n} characters.",
      auth_err_password_match: "Passwords do not match.",
      auth_err_signup: "Could not sign up.",
      auth_err_signup_unexpected:
        "Sign up failed unexpectedly. Try again, or use an external browser at the same URL.",

      onboard_title: "Almost there",
      onboard_lead: "Two quick details to finish setting up your account.",
      onboard_age_label: "Age",
      onboard_age_dec: "Decrease age",
      onboard_age_inc: "Increase age",
      onboard_level_label: "Level of complexity",
      onboard_level_easy: "Easy",
      onboard_level_hardcore: "Hardcore",
      onboard_level_1: "Easy",
      onboard_level_2: "Moderate",
      onboard_level_3: "Challenging",
      onboard_level_4: "Hard",
      onboard_level_5: "Hardcore",
      onboard_level_value: "{n} of 5 · {name}",
      onboard_continue: "Continue",
      onboard_err_age: "Enter an age between {min} and {max}.",

      like_btn_like: "Like · {n}",
      like_btn_unlike: "Remove like · {n}",

      footer_tagline: "HIIT sessions ready for your next workout.",
      footer_social_aria: "Social media",
      footer_col_company: "Company",
      footer_about: "About us",
      footer_contact: "Contact",
      footer_col_legal: "Legal",
      footer_terms: "Terms and conditions",
      footer_privacy: "Privacy policy",
      footer_health: "Health disclaimer",
      footer_col_explore: "Explore",
      footer_sessions: "Sessions",
      footer_copyright: "© {year} HIIT ME UP. All rights reserved.",
      footer_health_note: "Talk to your doctor before starting any exercise program.",

      page_title_about: "About us · HIIT",
      page_title_saved: "Saved sessions · HIIT",
      page_title_contact: "Contact · HIIT",
      page_title_terms: "Terms and conditions · HIIT",
      page_title_privacy: "Privacy policy · HIIT",
      page_title_health: "Health disclaimer · HIIT",
      info_placeholder: "We are preparing this page. The full content will be available here soon.",

      heatmap_title: "Completion calendar",
      heatmap_sub:
        "When you finish every exercise in a session, that day is marked.",
      heatmap_week_group: "Week",
      heatmap_prev_week: "Previous week",
      heatmap_next_week: "Next week",
      heatmap_today: "Today",
      heatmap_today_aria: "Go to the current week",
      heatmap_less: "Less",
      bm_section_aria: "Muscle map",
      bm_title: "Muscle map",
      bm_sub: "Each completed session lights up the muscles it worked.",
      bm_front: "Front",
      bm_back: "Back",
      bm_empty: "Complete a session to light up the muscles you trained.",
      bm_zone_shoulders: "Shoulders",
      bm_zone_chest: "Chest",
      bm_zone_biceps: "Biceps",
      bm_zone_triceps: "Triceps",
      bm_zone_forearms: "Forearms",
      bm_zone_abs: "Abs",
      bm_zone_quads: "Quads",
      bm_zone_calves: "Calves",
      bm_zone_upperback: "Upper back",
      bm_zone_lats: "Lats",
      bm_zone_lowerback: "Lower back",
      bm_zone_glutes: "Glutes",
      bm_zone_hamstrings: "Hamstrings",
      heatmap_more: "More",
      heatmap_scroll_aria: "Completion grid by day",
      heatmap_cell_none: "No completions",
      heatmap_cell_one: "1 session",
      heatmap_cell_many: "{n} sessions",
      heatmap_cell_cards: "Cards ",
      heatmap_cell_old: "Older completions (no card IDs)",
      heatmap_aria_day: "Day {day} · {month}",
      heatmap_aria_head: "{month}, day {day}",
      heatmap_aria_done: " · {n} completion",
      heatmap_aria_dones: " · {n} completions",
      heatmap_aria_ids: " · Card IDs: ",
      heatmap_aria_legacy: " · Card IDs not stored (logged before this update)",
    },
    es: {
      menu_account: "Menú de cuenta",
      menu_log_in: "Iniciar sesión",
      menu_sign_up: "Registrarse",
      menu_badges: "Medallas",
      menu_saved: "Sesiones guardadas",
      menu_profile: "Perfil",
      menu_log_out: "Cerrar sesión",

      page_title_dashboard: "HIIT · Tablero de entrenamiento",
      page_title_badges: "Medallas · HIIT",
      page_title_profile: "Perfil · HIIT",
      page_title_session: "Sesión · HIIT",
      page_title_account: "Cuenta · HIIT",
      page_title_not_found: "No encontrado · HIIT",

      brand_gym_floor: "Sesiones en el gym",
      brand_badges: "Medallas",
      brand_profile: "Perfil",
      brand_account: "Cuenta",

      search_placeholder: "Buscar por ID de tarjeta",
      search_aria: "Buscar por ID de tarjeta",

      theme_to_dark: "Cambiar a modo oscuro",
      theme_to_light: "Cambiar a modo claro",

      header_badges_aria: "Abrir medallas",
      saved_menu_aria: "Sesiones guardadas",
      saved_heading: "Sesiones guardadas",
      saved_empty: "Aún no tienes sesiones guardadas. Toca Guardar sesión en cualquier sesión para tenerla aquí.",
      saved_btn_save: "Guardar sesión",
      saved_btn_saved: "Guardada",
      header_badges_current: "Medallas",

      promo_banner_html:
        'Novedad: <strong>Medallas</strong> — mira los récords personales que has batido y sigue superándote.',
      promo_view_badges: "Ver medallas",
      promo_dismiss: "Cerrar aviso de medallas",

      dash_heading: "Tablero de entrenamiento",
      metrics_heading: "Métricas",
      metrics_collapse: "Contraer sección Métricas",
      metrics_expand: "Expandir sección Métricas",
      heatmap_section_aria: "Calendario de finalizaciones por día",
      metrics_grid_aria: "Recuento de sesiones",

      completed_heading: "Completadas",
      completed_sub:
        "Sesiones en las que cada ejercicio está marcado como hecho. Aparecen aquí automáticamente.",
      completed_empty: "Aún no hay sesiones completadas.",
      completed_empty_filter: "Ninguna sesión completada coincide con ese ID.",

      training_heading: "Tus bloques de entreno",
      training_sub:
        "Las tarjetas van numeradas en orden (#1, #2, …). Las sesiones en curso siguen aquí hasta marcar todos los ejercicios.",
      training_empty: "Todas las sesiones están completas — buen trabajo.",
      training_empty_filter: "Ninguna sesión activa coincide con ese ID.",

      carousel_completed_aria: "Sesiones completadas — desplázate horizontalmente",
      carousel_training_aria: "Sesiones activas — desplázate horizontalmente, toca una tarjeta para abrir",

      card_open_session: "Abrir sesión",
      detail_share_qr_aria: "Código QR con el enlace a esta sesión de entreno",
      detail_share_qr_fail: "No se pudo generar el QR — usa el enlace de abajo.",
      card_badge_complete: "Completa",
      card_badge_mostly: "Casi lista",
      metric_completed_label: "Tarjetas completadas",
      metric_remaining_label: "Tarjetas sin completar",

      detail_not_found: "No hay entreno con este ID.",
      detail_back_board: "Volver al tablero",
      detail_back_link: "← Tablero de entrenamiento",
      modal_close: "Cerrar",
      modal_no_illust: "No hay ilustración de referencia para esta línea.",
      detail_notes: "Notas",
      detail_hint:
        "Usa la casilla de cada línea para marcar los ejercicios que completaste. Toca el icono de información para ver la referencia de la postura. El progreso se guarda al instante; pulsa Guardar cuando quieras volver al tablero.",
      detail_exercises: "Ejercicios",
      detail_workout: "Entreno",
      detail_progress: "{done} de {total} ejercicios marcados como hechos.",
      detail_mark_all: "Marcar todo como hecho",
      detail_mark_all_aria: "Marcar todas las líneas de este entreno como completadas y guardar",
      detail_save: "Guardar",
      detail_save_aria: "Guardar y volver al tablero de entrenamiento",
      detail_view_illust: "Ver ilustración: {name}",

      badges_page_title: "Tus medallas",
      badges_page_lead:
        "Termina sesiones con todos los ejercicios marcados para registrar una finalización. Las medallas bloqueadas siguen ocultas hasta que alcances el hito en este dispositivo.",
      badges_summary:
        "{unlocked} de {total} medallas desbloqueadas — sigue terminando sesiones para iluminarlas.",
      badge_status_unlocked: "Desbloqueada",
      badge_status_locked: "Bloqueada",

      badge_first_finish_title: "Primera meta",
      badge_first_finish_desc: "Completa cualquier entreno con todos los ejercicios marcados.",
      badge_triple_threat_title: "Triple amenaza",
      badge_triple_threat_desc: "Registra 3 finalizaciones de sesión completas.",
      badge_ten_club_title: "Club del diez",
      badge_ten_club_desc: "Registra 10 finalizaciones de sesión completas.",
      badge_twenty_five_title: "Cuarto de siglo",
      badge_twenty_five_desc: "Registra 25 finalizaciones de sesión completas.",
      badge_mix_three_title: "Varía el ritmo",
      badge_mix_three_desc: "Termina 3 sesiones distintas (por tarjeta).",
      badge_mix_seven_title: "Muestrario amplio",
      badge_mix_seven_desc: "Termina 7 sesiones distintas.",
      badge_mix_ten_title: "Recorre el mazo",
      badge_mix_ten_desc: "Termina 10 sesiones distintas.",
      badge_week_surge_title: "Oleada semanal",
      badge_week_surge_desc: "Termina 4+ sesiones en una misma semana natural.",
      badge_five_day_spread_title: "Cinco días",
      badge_five_day_spread_desc: "Entrena en 5 días naturales distintos.",
      badge_ten_day_spread_title: "Hábito de diez días",
      badge_ten_day_spread_desc: "Entrena en 10 días naturales distintos.",

      profile_gate_title: "Inicia sesión",
      profile_gate_lead: "Inicia sesión o crea una cuenta para ver y editar tu perfil en este dispositivo.",
      profile_log_in: "Iniciar sesión",
      profile_sign_up_link: "Registrarse",
      profile_content_title: "Tu perfil",
      profile_content_lead: "Actualiza tus datos. Todo se guarda solo en este dispositivo.",
      profile_first_name: "Nombre",
      profile_last_name: "Apellidos",
      profile_age: "Edad",
      profile_level: "Nivel de complejidad",
      profile_gender: "Género",
      profile_country: "País",
      profile_email: "Correo",
      profile_phone: "Teléfono",
      profile_email_hint: "El correo coincide con tu cuenta y no se puede cambiar aquí.",
      profile_save: "Guardar perfil",
      profile_select: "Elegir…",
      profile_gender_female: "Mujer",
      profile_gender_male: "Hombre",
      profile_gender_nb: "No binario",
      profile_gender_other: "Otro",
      profile_gender_prefer_not: "Prefiero no decirlo",
      profile_saved: "Perfil guardado.",
      profile_err_email: "Introduce un correo válido o déjalo en blanco.",

      auth_login_title: "Iniciar sesión",
      auth_login_lead: "Usa el correo y la contraseña con los que te registraste en este dispositivo.",
      auth_email: "Correo electrónico",
      auth_password: "Contraseña",
      auth_confirm_password: "Confirmar contraseña",
      auth_login_submit: "Iniciar sesión",
      auth_need_account: "¿No tienes cuenta?",
      auth_sign_up_btn: "Registrarse",
      auth_signup_title: "Registrarse",
      auth_signup_lead: "Crea una cuenta local. Los datos solo están en este navegador.",
      auth_create_account: "Crear cuenta",
      auth_have_account: "¿Ya tienes cuenta?",
      auth_login_btn: "Iniciar sesión",
      auth_forgot_link: "¿Olvidaste tu contraseña?",
      auth_forgot_title: "Restablecer contraseña",
      auth_forgot_lead:
        "Las cuentas solo se guardan en este navegador, así que no podemos enviarte un correo. Introduce el correo con el que te registraste y elige una contraseña nueva.",
      auth_new_password: "Contraseña nueva",
      auth_forgot_submit: "Restablecer contraseña",
      auth_back_to_login: "Volver a iniciar sesión",
      auth_err_reset_no_account: "No hay ninguna cuenta con ese correo en este dispositivo.",
      auth_err_reset_unexpected: "No se pudo restablecer la contraseña. Inténtalo de nuevo.",
      auth_err_email: "Introduce un correo válido.",
      auth_err_password: "Introduce tu contraseña.",
      auth_err_login: "No se pudo iniciar sesión.",
      auth_err_login_unexpected:
        "Error inesperado al iniciar sesión. Inténtalo de nuevo o usa un navegador externo en la misma URL.",
      auth_err_password_min: "La contraseña debe tener al menos {n} caracteres.",
      auth_err_password_match: "Las contraseñas no coinciden.",
      auth_err_signup: "No se pudo registrar.",
      auth_err_signup_unexpected:
        "Error inesperado al registrarse. Inténtalo de nuevo o usa un navegador externo en la misma URL.",

      onboard_title: "Ya casi",
      onboard_lead: "Dos datos rápidos para terminar de configurar tu cuenta.",
      onboard_age_label: "Edad",
      onboard_age_dec: "Disminuir edad",
      onboard_age_inc: "Aumentar edad",
      onboard_level_label: "Nivel de complejidad",
      onboard_level_easy: "Fácil",
      onboard_level_hardcore: "Hardcore",
      onboard_level_1: "Fácil",
      onboard_level_2: "Moderado",
      onboard_level_3: "Desafiante",
      onboard_level_4: "Difícil",
      onboard_level_5: "Hardcore",
      onboard_level_value: "{n} de 5 · {name}",
      onboard_continue: "Continuar",
      onboard_err_age: "Introduce una edad entre {min} y {max}.",

      like_btn_like: "Me gusta · {n}",
      like_btn_unlike: "Quitar me gusta · {n}",

      footer_tagline: "Sesiones HIIT listas para tu próximo entrenamiento.",
      footer_social_aria: "Redes sociales",
      footer_col_company: "Compañía",
      footer_about: "Sobre nosotros",
      footer_contact: "Contacto",
      footer_col_legal: "Legal",
      footer_terms: "Términos y condiciones",
      footer_privacy: "Política de privacidad",
      footer_health: "Aviso de salud",
      footer_col_explore: "Explora",
      footer_sessions: "Sesiones",
      footer_copyright: "© {year} HIIT ME UP. Todos los derechos reservados.",
      footer_health_note: "Consulta a tu médico antes de empezar cualquier programa de ejercicio.",

      page_title_about: "Sobre nosotros · HIIT",
      page_title_saved: "Sesiones guardadas · HIIT",
      page_title_contact: "Contacto · HIIT",
      page_title_terms: "Términos y condiciones · HIIT",
      page_title_privacy: "Política de privacidad · HIIT",
      page_title_health: "Aviso de salud · HIIT",
      info_placeholder: "Estamos preparando esta página. Muy pronto encontrarás aquí el contenido completo.",

      heatmap_title: "Calendario de finalizaciones",
      heatmap_sub:
        "Cuando terminas todos los ejercicios de una sesión, ese día queda marcado.",
      heatmap_week_group: "Semana",
      heatmap_prev_week: "Semana anterior",
      heatmap_next_week: "Semana siguiente",
      heatmap_today: "Hoy",
      heatmap_today_aria: "Ir a la semana actual",
      heatmap_less: "Menos",
      bm_section_aria: "Mapa muscular",
      bm_title: "Mapa muscular",
      bm_sub: "Cada sesión completada ilumina los músculos que trabajaste.",
      bm_front: "Frente",
      bm_back: "Dorso",
      bm_empty: "Completa una sesión para iluminar los músculos que entrenaste.",
      bm_zone_shoulders: "Hombros",
      bm_zone_chest: "Pecho",
      bm_zone_biceps: "Bíceps",
      bm_zone_triceps: "Tríceps",
      bm_zone_forearms: "Antebrazos",
      bm_zone_abs: "Abdomen",
      bm_zone_quads: "Cuádriceps",
      bm_zone_calves: "Gemelos",
      bm_zone_upperback: "Espalda alta",
      bm_zone_lats: "Dorsales",
      bm_zone_lowerback: "Zona lumbar",
      bm_zone_glutes: "Glúteos",
      bm_zone_hamstrings: "Isquiotibiales",
      heatmap_more: "Más",
      heatmap_scroll_aria: "Cuadrícula de finalizaciones por día",
      heatmap_cell_none: "Sin finalizaciones",
      heatmap_cell_one: "1 sesión",
      heatmap_cell_many: "{n} sesiones",
      heatmap_cell_cards: "Tarjetas ",
      heatmap_cell_old: "Finalizaciones antiguas (sin IDs de tarjeta)",
      heatmap_aria_day: "Día {day} · {month}",
      heatmap_aria_head: "{month}, día {day}",
      heatmap_aria_done: " · {n} finalización",
      heatmap_aria_dones: " · {n} finalizaciones",
      heatmap_aria_ids: " · IDs de tarjeta: ",
      heatmap_aria_legacy: " · IDs no guardados (registrado antes de esta actualización)",
    },
  };

  /**
   * Spanish only for the Latin American launch, so there is no language selector and no stored
   * preference. The English bundle is kept: to bring switching back, restore the language
   * selectors and read the choice from localStorage here.
   */
  function getLang() {
    return "es";
  }

  function tf(key, vars) {
    var s = t(key);
    if (!vars) return s;
    Object.keys(vars).forEach(function (k) {
      s = s.split("{" + k + "}").join(String(vars[k]));
    });
    return s;
  }

  function t(key) {
    var lang = getLang();
    var bundle = MESSAGES[lang] || MESSAGES.en;
    if (bundle[key] != null) return bundle[key];
    return MESSAGES.en[key] != null ? MESSAGES.en[key] : key;
  }

  function apply(root) {
    var scope = root && root.querySelector ? root : document;
    scope.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (!key) return;
      el.textContent = t(key);
    });
    scope.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-html");
      if (!key) return;
      el.innerHTML = t(key);
    });
    scope.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-placeholder");
      if (key) el.setAttribute("placeholder", t(key));
    });
    scope.querySelectorAll("[data-i18n-aria-label]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-aria-label");
      if (key) el.setAttribute("aria-label", t(key));
    });
    scope.querySelectorAll("[data-i18n-title]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-title");
      if (key) el.setAttribute("title", t(key));
    });
    scope.querySelectorAll("option[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (key) el.textContent = t(key);
    });
    var titleEl = document.querySelector("title[data-i18n]");
    if (titleEl) {
      var tk = titleEl.getAttribute("data-i18n");
      if (tk) document.title = t(tk);
    }
  }

  document.documentElement.setAttribute("lang", getLang());

  document.addEventListener("DOMContentLoaded", function () {
    apply();
  });

  window.HiitI18n = {
    getLang: getLang,
    t: t,
    tf: tf,
    apply: apply,
  };
})();
