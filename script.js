/* =========================================================
   ESPERAR A QUE CARGUE TODO EL HTML
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     ELEMENTOS
  ======================================================= */

  const botonAbrir =
    document.getElementById("botonAbrir");

  const botonRecuerdos =
    document.getElementById("botonRecuerdos");

  const inicio =
    document.getElementById("inicio");

  const cumpleanos =
    document.getElementById("cumpleanos");

  const recuerdos =
    document.getElementById("recuerdos");

  const confeti =
    document.getElementById("confeti");


  let confetiCreado = false;


  /* =======================================================
     MUSICA
  ======================================================= */

  const musicaInicio =
    new Audio("musica/inicio.mpeg");

  const musicaRecuerdos =
    new Audio("musica/recuerdos.mp3");


  musicaInicio.preload = "auto";
  musicaRecuerdos.preload = "auto";

  musicaInicio.loop = true;
  musicaRecuerdos.loop = true;

  musicaInicio.volume = 0.35;
  musicaRecuerdos.volume = 0.35;


  /* =======================================================
     BOTON 1 - ABRIR SORPRESA
  ======================================================= */

  if (botonAbrir) {

    botonAbrir.addEventListener(
      "click",
      async () => {

        console.log("Abriendo cumpleaños...");

        cambiarPantalla(
          inicio,
          cumpleanos
        );


        /* MUSICA INICIAL */

        try {

          musicaRecuerdos.pause();
          musicaRecuerdos.currentTime = 0;

          musicaInicio.currentTime = 0;
          musicaInicio.volume = 0;

          await musicaInicio.play();

          subirVolumen(
            musicaInicio,
            0.35
          );

        } catch (error) {

          console.log(
            "No se pudo iniciar la música principal:",
            error
          );

        }


        /* CONFETI */

        if (!confetiCreado) {

          setTimeout(() => {

            crearConfeti();

            confetiCreado = true;

          }, 350);

        }

      }
    );

  } else {

    console.error(
      "No se encontró botonAbrir"
    );

  }


  /* =======================================================
     BOTON 2 - VER RECUERDOS
  ======================================================= */

  if (botonRecuerdos) {

    botonRecuerdos.addEventListener(
      "click",
      () => {

        console.log(
          "Abriendo recuerdos..."
        );


        /*
          CAMBIAMOS DE PANTALLA PRIMERO.
          Esto ocurre inmediatamente.
        */

        cambiarPantalla(
          cumpleanos,
          recuerdos
        );


        /*
          CAMBIAMOS LA MUSICA DESPUES.
          La transición visual no depende del audio.
        */

        cambiarMusicaARecuerdos();

      }
    );

  } else {

    console.error(
      "No se encontró botonRecuerdos"
    );

  }


  /* =======================================================
     CAMBIAR PANTALLA
  ======================================================= */

  function cambiarPantalla(
    actual,
    siguiente
  ) {

    if (!actual) {

      console.error(
        "No existe la pantalla actual."
      );

      return;

    }


    if (!siguiente) {

      console.error(
        "No existe la siguiente pantalla."
      );

      return;

    }


    actual.classList.remove(
      "activa"
    );


    setTimeout(() => {

      siguiente.classList.add(
        "activa"
      );


      /*
        Cuando entramos en recuerdos,
        comenzar desde arriba.
      */

      if (
        siguiente.id ===
        "recuerdos"
      ) {

        siguiente.scrollTop = 0;

      }

    }, 350);

  }


  /* =======================================================
     CAMBIAR MUSICA
  ======================================================= */

  async function cambiarMusicaARecuerdos() {

    try {

      /*
        Bajamos un poco la música principal.
      */

      if (!musicaInicio.paused) {

        await bajarVolumen(
          musicaInicio
        );

      }


      musicaInicio.pause();

      musicaInicio.currentTime = 0;

      musicaInicio.volume = 0.35;


      /*
        Comenzamos recuerdos.
      */

      musicaRecuerdos.currentTime = 0;

      musicaRecuerdos.volume = 0;


      await musicaRecuerdos.play();


      subirVolumen(
        musicaRecuerdos,
        0.35
      );

    } catch (error) {

      /*
        Si el audio falla,
        LA GALERIA IGUAL FUNCIONA.
      */

      console.log(
        "La galería abrió, pero hubo un problema con el audio:",
        error
      );

    }

  }


  /* =======================================================
     CREAR CONFETI
  ======================================================= */

  function crearConfeti() {

    if (!confeti) {

      return;

    }


    for (
      let i = 0;
      i < 120;
      i++
    ) {

      const pieza =
        document.createElement(
          "span"
        );


      pieza.classList.add(
        "pieza-confeti"
      );


      pieza.style.left =
        Math.random() *
        100 +
        "vw";


      pieza.style.animationDuration =
        3 +
        Math.random() *
        4 +
        "s";


      pieza.style.animationDelay =
        Math.random() *
        2 +
        "s";


      pieza.style.transform =
        `rotate(${
          Math.random() *
          360
        }deg)`;


      confeti.appendChild(
        pieza
      );

    }

  }


  /* =======================================================
     BAJAR VOLUMEN
  ======================================================= */

  function bajarVolumen(audio) {

    return new Promise(
      (resolve) => {

        if (
          !audio ||
          audio.paused
        ) {

          resolve();

          return;

        }


        const intervalo =
          setInterval(() => {

            const siguienteVolumen =
              audio.volume -
              0.05;


            if (
              siguienteVolumen >
              0
            ) {

              audio.volume =
                siguienteVolumen;

            } else {

              audio.volume = 0;

              clearInterval(
                intervalo
              );

              resolve();

            }

          }, 60);

      }
    );

  }


  /* =======================================================
     SUBIR VOLUMEN
  ======================================================= */

  function subirVolumen(
    audio,
    volumenFinal
  ) {

    if (!audio) {

      return;

    }


    const intervalo =
      setInterval(() => {

        const siguienteVolumen =
          audio.volume +
          0.05;


        if (
          siguienteVolumen <
          volumenFinal
        ) {

          audio.volume =
            siguienteVolumen;

        } else {

          audio.volume =
            volumenFinal;

          clearInterval(
            intervalo
          );

        }

      }, 60);

  }


  /* =======================================================
     CONTROL DE AUDIO
  ======================================================= */

  musicaInicio.addEventListener(
    "error",
    () => {

      console.log(
        "Revisa el archivo musica/inicio.mpeg"
      );

    }
  );


  musicaRecuerdos.addEventListener(
    "error",
    () => {

      console.log(
        "Revisa el archivo musica/recuerdos.mp3"
      );

    }
  );

});