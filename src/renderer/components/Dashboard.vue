<template>
  <section class="section is-dark">
    <div class="tile is-ancestor">
      <div class="tile is-8 is-vertical do-not-scroll">
        <div class="tile is-parent">
          <div class="tile is-child">
            <h1 class="title">Friends</h1>
            <div class="is-divider"></div>
          </div>
        </div>
        <div class="tile is-parent">
          <div class="tile is-child is-9">
            <b-checkbox v-model="online_only">Show only online</b-checkbox>
          </div>
          <div class="tile is-child is-3">
            <b-field position="is-right">
              <b-input placeholder="Search..." type="search" icon="search" v-model="search_filter"></b-input>
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
              <div class="column is-3" v-for="(friend, key) in availableFriends" :key="key" v-if="filterSearch(friend)">
                <div class="card">
                  <div class="card-content">
                    <div class="media">
                      <div class="media-left">
                        <figure class="image is-48x48">
                          <img :src="friend.avatar_url_full">
                        </figure>
                      </div>
                      <div class="media-content">
                        <p class="title is-5" :class="getStateClass(friend.persona_state)">{{ friend.player_name }}</p>
                        <p class="subtitle is-6" :class="getStateClass(friend.persona_state)">{{ getPersonaState(friend.persona_state) }}</p>
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
          <b-collapse class="card" v-for="(tag, key) in this.$store.state.Steam.tags" :key="key" :open="false">
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
                <div class="card" v-for="(member, key) in sortMembers(key)" :key="key">
                  <div class="card-content">
                    <div class="media">
                      <div class="media-left is-marginless">
                        <figure class="image is-48x48">
                          <img :src="s().friends[member.getSteamID64()].avatar_url_full">
                        </figure>
                      </div>
                      <div class="media-content">
                        <p class="title is-5" :class="getStateClass(s().friends[member.getSteamID64()].persona_state)">{{ s().friends[member.getSteamID64()].player_name }}</p>
                        <p class="subtitle is-6" :class="getStateClass(s().friends[member.getSteamID64()].persona_state)">{{ getPersonaState(s().friends[member.getSteamID64()].persona_state) }}</p>
                      </div>
                      <div class="media-right">
                        <b-checkbox></b-checkbox>
                      </div>
                    </div>
                    <b-taglist>
                      <b-tag type="is-success" v-for="(tag, index) in s().tagsMap[member.getSteamID64()]" :key="index">{{ tag }}</b-tag>
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
import * as fuzzysearch from "fuzzysearch";
import * as _ from "lodash";

const SteamUser = remote.getGlobal("SteamUser");

export default {
  name: "Dashboard",
  data() {
    return {
      online_only: false,
      search_filter: ""
    };
  },
  methods: {
    s() {
      return this.$store.state.Steam;
    },
    getPersonaState(state) {
      return state === null ? "Offline" : SteamUser.EPersonaState[state];
    },
    getStateClass(state) {
      return state === null || state === SteamUser.EPersonaState.Offline
        ? ""
        : "has-text-info";
    },
    sortMembers(m) {
      return _.sortBy(
        this.s().tags[m].members,
        o => this.s().friends[o.getSteamID64()].persona_state
      );
    },
    filterSearch(m) {
      if (this.search_filter.length > 0) {
        return fuzzysearch(this.search_filter.toUpperCase(), m.player_name.toUpperCase());
      }
      return true;
    },
  },
  computed: {
    availableFriends() {
      if (this.online_only) {
        const filtered = {};
        Object.keys(this.s().friends).forEach((friend) => {
          if (this.s().friends[friend].persona_state !== null)
            filtered[friend] = this.s().friends[friend];
        });
        return _.sortBy(filtered, "persona_state");
      }
      return _.sortBy(this.s().friends, "persona_state");
    }
  }
};
</script>

<style>
.media-content {
  overflow: hidden !important;
}
.content figure {
  margin-left: 0;
}
.do-not-scroll {
  height: 100vh;
  display: block !important;
}
</style>
