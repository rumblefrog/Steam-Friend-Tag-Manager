<template>
  <section class="hero is-fullheight">
    <div class="hero-body">
        <div class="column is-4 is-offset-4">
          <b-field>
            <b-input v-model="username" icon="user" placeholder="Username ..."></b-input>
          </b-field>
          <b-field>
            <b-input type="password" v-model="password" icon="key" placeholder="Password ..." password-reveal></b-input>
          </b-field>
          <b-field>
            <button class="button is-primary" @click="login()">
              <span>Login</span>
            </button>
          </b-field>
        </div>
        <b-modal :active.sync="guardPrompt" has-modal-card>
          <div class="modal-card">
            <header class="modal-card-head">
              <p class="modal-card-title">Steam Mobile Authenticator
                <span v-if="domain !== null">({{ domain }})</span>
              </p>
            </header>
            <section class="modal-card-body">
              <b-field>
                <b-input v-model="twofa" icon="key" placeholder="Steam Authenticator Code ..."></b-input>
              </b-field>
            </section>
            <footer class="modal-card-foot">
              <button class="button is-success" @click="submit2fa()">
                <span>Login</span>
              </button>
            </footer>
          </div>
        </b-modal>
    </div>
  </section>
</template>

<script>
import { remote } from "electron";

const client = remote.getGlobal("client");
const SteamUser = remote.getGlobal("SteamUser");

export default {
  name: "Login",
  data() {
    return {
      username: null,
      password: null,
      twofa: null,
      domain: null,
      callback: null,
      guardPrompt: false
    };
  },
  methods: {
    login() {
      client.logOn({
        accountName: this.username,
        password: this.password
      });
    },
    submit2fa() {
      this.callback(this.twofa);
      this.guardPrompt = false;
    }
  },
  mounted() {
    client.on("steamGuard", (domain, callback) => {
      this.domain = domain;
      this.callback = callback;
      this.guardPrompt = true;
    });
    client.on("loggedOn", () => {
      client.setPersona(SteamUser.EPersonaState.Online);
    });
    client.on("friendPersonasLoaded", () => {
      const p = [];

      Object.keys(client.myFriends).forEach(key => {
        if (client.myFriends[key] === SteamUser.EFriendRelationship.Friend) p.push(key);
      });

      client.getPersonas(p, personas => {
        this.$store.dispatch("updateFriends", personas);
        this.$router.push("dashboard");
      });
    });
    client.on("friendsGroupList", tags => {
      this.$store.dispatch("updateTags", tags);
    });
  }
};
</script>

<style>

</style>
