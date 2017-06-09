<template>
    <div id="Main">
        <router-view></router-view>
    </div>
</template>


<script>
// export vue definition
export default { name: 'app' }

// hot reloading
if(module.hot){
    module.hot.accept()
}
</script>


<style>
/* ---- Colours ---- */

/* Primary
   #
*/

/* Secondary
   #
*/

/* Highlight
   #
*/


/* ---- General CSS ---- */

body {
    position: absolute;
    top: 0; left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;

    /*PRIMARY FONT*/
    font-family: 'Roboto', sans-serif;
}

h1,h2,h3,h4,h5,.title {
    font-weight: 100;
    font-size: 20px;
    line-height: 22px;
    letter-spacing: 2px;
    font-weight: bold;

    /*TITLE FONT*/
    /*font-family: 'Roboto', sans-serif;*/
}

input,
textarea {
    font-family: inherit;
}

input:focus,
textarea:focus {
    outline: none;
}

a {
    text-decoration: none;
    color: inherit;
}

::-webkit-input-placeholder { /* Chrome/Opera/Safari */
  color: #CCC;
  font-family: inherit;
}
::-moz-placeholder { /* Firefox 19+ */
  color: #CCC;
  font-family: inherit;
}
:-ms-input-placeholder { /* IE 10+ */
  color: #CCC;
  font-family: inherit;
}
:-moz-placeholder { /* Firefox 18- */
  color: #CCC;
  font-family: inherit;
}

.break {
    white-space: pre;
}

.centre {
    text-align: center;
}

.right {
    text-align: right;
}

#Main {
    width: 100%;
    height: 100%;
}


/* ---- No Select ---- */

.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
}


/* ---- Media Queries ---- */

/* Larger than mobile */
@media (min-width: 400px) {}

/* Larger than phablet */
@media (min-width: 550px) {}

/* Larger than tablet */
@media (min-width: 750px) {}

/* Larger than desktop */
@media (min-width: 1000px) {}

/* Larger than Desktop HD */
@media (min-width: 1200px) {}


/** ie10mobile.css **/
@-webkit-viewport {
    width: device-width;
}

@-moz-viewport {
    width: device-width;
}

@-ms-viewport {
    width: device-width;
}

@-o-viewport {
    width: device-width;
}

@viewport {
    width: device-width;
}


/* –––– Transitions –––– */


/* –––– Animations –––– */

</style>
