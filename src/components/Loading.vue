<template>
  <div v-if="isLoading" class="modal">
    <div class="modal-content">
      <div class="loader-container">
        <div class="loader"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    isLoading: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
};
</script>
<style lang="scss" scoped>
/* The Modal (background) */
.modal {
  position: fixed; /* Stay in place */
  z-index: 100; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.8); /* Black w/ opacity */
}

/* Modal Content/Box */
.modal-content {
  margin: 30vh auto; /* 15% from the top and centered */
  padding: 20px;
  width: 80%; /* Could be more or less, depending on screen size */
}

.loader-container {
  background-image: url("/images/max.png");
  background-repeat: no-repeat;
  background-size: 95px 95px;
  background-position: center center;
  z-index: 101; /* Sit on top */
  width: 130px;
  height: 130px;
  margin: auto;
  animation: zoom 1s infinite;
}

.loader {
  border: 16px solid #f3f3f3;
  border-top: 16px solid #990000;
  border-left: 16px solid #00b4ee;
  border-bottom: 16px solid #990000;
  border-right: 16px solid #00b4ee;
  border-radius: 50%;
  width: 130px;
  height: 130px;
  animation: spin 2s linear infinite;
  margin: auto;
}

@keyframes zoom {
  0% {
    background-size: 80px 80px;
  }
  50% {
    background-size: 95px 95px;
  }
  100% {
    background-size: 80px 80px;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
