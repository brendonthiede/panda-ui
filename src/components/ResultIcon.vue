<template>
  <a :href="link">
    <span v-if="state === 'Successful'">
      <img src="http://bamboo.sircon.com/s/en_US/51120/1/_/images/iconsv4/icon-build-successful.png"/>
    </span>
    <span v-else="">
      <span v-if="state === 'Failed'">
        <img src="http://bamboo.sircon.com/s/en_US/51120/1/_/images/iconsv4/icon-build-failed.png"/>
      </span>
      <span v-else="">
        <img src="http://bamboo.sircon.com/s/en_US/51120/1/_/images/iconsv4/icon-build-unknown.png"/>
      </span>
    </span>
  </a>
</template>
<script>
  export default{
    props: ['state', 'link']
  }
</script>
