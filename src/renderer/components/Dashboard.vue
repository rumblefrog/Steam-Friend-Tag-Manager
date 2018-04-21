<template>
  <section class="section is-dark">
    <div class="tile is-ancestor">
      <div class="tile is-8 is-vertical do-not-scroll">
        <div class="tile is-parent">
          <div class="tile is-child">
            <div class="level">
              <div class="level-left">
                <h1 class="title level-item">Friends</h1>
              </div>
              <div class="level-right">
                <b-icon icon="sync" class="level-item fa-spin" v-if="loading"></b-icon>
              </div>
            </div>
            <div class="is-divider"></div>
          </div>
        </div>
        <div class="tile is-parent">
          <div class="tile is-child is-9">
            <b-checkbox v-model="online_only">Show only online</b-checkbox>
          </div>
          <div class="tile is-child is-3">
            <b-field position="is-right">
              <b-input placeholder="Search..." 
                type="search" 
                icon="search" 
                v-model="search_filter">
              </b-input>
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
              <div class="column is-3" 
                v-for="friend in availableFriends" 
                :key="friend._id" 
                v-if="filterSearch(friend)">
                <div class="card" @click="selectUser(friend._id)">
                  <div class="card-content">
                    <div class="media">
                      <div class="media-left">
                        <figure class="image is-48x48">
                          <img :src="friend.avatar_url_full">
                        </figure>
                      </div>
                      <div class="media-content">
                        <p class="title is-5" :class="getStateClass(friend.persona_state)">
                          {{ friend.player_name }}
                        </p>
                        <p class="subtitle is-6" :class="getStateClass(friend.persona_state)">
                          {{ getPersonaState(friend.persona_state) }}
                        </p>
                      </div>
                      <div class="media-right">
                        <b-checkbox></b-checkbox>
                      </div>
                    </div>
                    <b-taglist>
                      <b-tag type="is-success" 
                        v-for="tag in s().tagsMap[friend._id]" 
                        :key="tag.key">
                        {{ tag.name }}
                      </b-tag>
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
          <div v-if="selected != null">
            <div class="media">
              <div class="media-left">
                <figure class="image is-64x64">
                  <img :src="s().friends[this.selected].avatar_url_full">
                </figure>
              </div>
              <div class="media-content">
                <p class="title is-5" 
                  :class="getStateClass(s().friends[this.selected].persona_state)">
                  {{ s().friends[this.selected].player_name }}
                </p>
                <p class="subtitle is-6" 
                  :class="getStateClass(s().friends[this.selected].persona_state)">
                  {{ getPersonaState(s().friends[this.selected].persona_state) }}
                </p>
              </div>
            </div>
            <div class="is-divider"></div>
            <b-field 
              v-for="(tag, groupid) in this.$store.state.Steam.tags" 
              :key="groupid">
              <b-checkbox 
                :value="isInTag(selected, groupid)"
                @input="addToQueue(selected, groupid, ...arguments)">
                {{ tag.name }}
              </b-checkbox>
            </b-field>
          </div>
          <div v-else>
            <h1 class="title has-text-grey has-text-centered">Select a friend from the left to begin!</h1>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { remote } from "electron";
import * as fuzzysearch from "fuzzysearch";
import * as _ from "lodash";

const client = remote.getGlobal("client");
const SteamUser = remote.getGlobal("SteamUser");

export default {
  name: "Dashboard",
  data() {
    return {
      online_only: false,
      search_filter: "",
      loading: false,
      selected: null,
      new_user: null,
      queue: [],
      timeout: null
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
        return fuzzysearch(
          this.search_filter.toUpperCase(),
          m.player_name.toUpperCase()
        );
      }
      return true;
    },
    isInTag(steamid, search) {
      if (this.s().tagsMap[steamid]) {
        return this.s().tagsMap[steamid].some(tag => {
          return tag.key === search;
        });
      }

      return false;
    },
    selectUser(user) {
      this.selected = user;

      if (this.new_user === null) this.new_user = false;
      else this.new_user = true;
    },
    addToQueue(user, groupid, add) {
      if (this.new_user) {
        this.new_user = false;
        return;
      }

      if ((add && this.isInTag(user, groupid)) || (!add && !this.isInTag(user, groupid)))
        return; 

      const pass = this.queue.every((item, index) => {
        if (item.user === user && item.groupid === groupid && item.add === add)
          return false;

        if (
          item.user === user &&
          item.groupid === groupid &&
          item.add !== add
        ) {
          this.queue.splice(index, 1);
          return false;
        }

        return true;
      });

      if (pass) {
        this.queue.push({
          "user": user,
          "groupid": groupid,
          "add": add
        });
      }

      clearTimeout(this.timeout);

      this.timeout = setTimeout(() => {
        this.processQueue();
      }, 2000);
    },
    processQueue() {
      this.loading = true;

      const promises = [];

      this.queue.forEach((item) => {
        if (item.add) {
          promises.push(
            new Promise((resolve, reject) => {
              client.addFriendToGroup(
                parseInt(item.groupid, 10),
                item.user,
                err => {
                  if (err) reject(err);
                  else resolve();
                }
              );
            })
          );
        } else {
          promises.push(
            new Promise((resolve, reject) => {
              client.removeFriendFromGroup(
                parseInt(item.groupid, 10),
                item.user,
                err => {
                  if (err) reject(err);
                  else resolve();
                }
              );
            })
          );
        }
      });

      Promise.all(promises).then(() => {
        this.queue = [];
        this.updateTags();
        this.loading = false;
      });
    },
    updateTags() {
      this.$store.dispatch("updateTags", client.myFriendGroups);
    }
  },
  computed: {
    availableFriends() {
      const filtered = {};
      Object.keys(this.s().friends).forEach(friend => {
        if (
          !this.online_only ||
          this.s().friends[friend].persona_state !== null
        )
          filtered[friend] = Object.assign(this.s().friends[friend], {
            _id: friend
          });
      });
      return _.sortBy(filtered, "persona_state");
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
