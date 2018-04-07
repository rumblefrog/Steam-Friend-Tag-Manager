<template>
    <div class="columns">
        <div class="column is-4 is-offset-4">
            <b-field>
                <b-input v-model="username" icon="user" placeholder="Username ..."></b-input>
            </b-field>
            <b-field>
              <b-input type="password" v-model="password" icon="key" placeholder="Password ..." password-reveal></b-input>
            </b-field>
            <b-field>
              <button class="button is-primary">
                <span>Login</span>
              </button>
            </b-field>
        </div>
    </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      username: null,
      password: null
    };
  }
};
</script>

<style>

</style>
