<template>
  <section class="section">
    <div class="tile is-ancestor">
      <div class="tile is-8 is-vertical">
        <div class="tile is-parent">
          <div class="tile is-child">
            <h1 class="title">Friends</h1>
            <div class="is-divider"></div>
          </div>
        </div>
        <div class="tile is-parent">
          <div class="tile is-child is-9">
            <b-checkbox>Show only online</b-checkbox>
          </div>
          <div class="tile is-child is-3">
            <b-field position="is-right">
              <b-input placeholder="Search..." type="search" icon="search"></b-input>
            </b-field>
          </div>
        </div>
        <div class="tile is-parent">
          <div class="tile is-child">
            <div class="is-divider"></div>
          </div>
        </div>
        <div class="tile is-parent">
          <div class="tile is-child">
            <div class="columns is-multiline">
              <div class="column is-3" v-for="(friend, key) in this.$store.state.Steam.friends" :key="key">
                <div class="card">
                  <div class="card-content">
                    <div class="media">
                      <div class="media-left">
                        <figure class="image is-48x48">
                          <img :src="friend.avatar_url_full">
                        </figure>
                      </div>
                      <div class="media-content">
                        <p class="title is-5">{{ friend.player_name }}</p>
                        <p class="subtitle is-6">{{ getPersonaState(friend.persona_state) }}</p>
                      </div>
                      <div class="media-right">
                        <b-checkbox></b-checkbox>
                      </div>
                    </div>
                    <b-taglist>
                      <b-tag type="is-success" v-for="tag in s().tagsMap[key]" :key="tag">{{ tag }}</b-tag>
                    </b-taglist>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="is-divider-vertical"></div>
      <div class="tile is-3 is-parent is-vertical">
        <div class="tile is-child">
          <h1 class="title">Tags</h1>
          <div class="is-divider"></div>
          <b-collapse class="card" v-for="(tag, key) in this.$store.state.Steam.tags" :key="key">
            <div slot="trigger" slot-scope="props" class="card-header">
              <p class="card-header-title">
                {{ tag.name }}
              </p>
              <a class="card-header-icon">
                <b-icon :icon="props.open ? 'caret-down' : 'caret-up'">
                </b-icon>
              </a>
            </div>
            <div class="card-content">
              <div class="content">
                <div class="card" v-for="(member, key) in tag.members" :key="key">
                  <div class="card-content">
                    <div class="media">
                      <div class="media-left is-marginless">
                        <figure class="image is-48x48">
                          <img :src="s().friends[member.getSteamID64()].avatar_url_full">
                        </figure>
                      </div>
                      <div class="media-content">
                        <p class="title is-5">{{ s().friends[member.getSteamID64()].player_name }}</p>
                        <p class="subtitle is-6">{{ getPersonaState(s().friends[member.getSteamID64()].persona_state) }}</p>
                      </div>
                      <div class="media-right">
                        <b-checkbox></b-checkbox>
                      </div>
                    </div>
                    <b-taglist>
                      <b-tag type="is-success" v-for="tag in s().tagsMap[member.getSteamID64()]" :key="tag">{{ tag }}</b-tag>
                    </b-taglist>
                  </div>
                </div>
              </div>
            </div>
            <footer class="card-footer">
              <a class="card-footer-item">Rename</a>
              <a class="card-footer-item">Delete</a>
            </footer>
          </b-collapse>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { remote } from "electron";

const SteamUser = remote.getGlobal("SteamUser");

export default {
  name: "Dashboard",
  methods: {
    s() {
      return this.$store.state.Steam;
    },
    getPersonaState(state) {
      return (state === null) ? "Offline" : SteamUser.EPersonaState[state];
    }
  }
};
</script>

<style>
.media-content {
  overflow: hidden;
}
.content figure {
  margin-left: 0;
}
</style>
