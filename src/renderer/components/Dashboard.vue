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
        <div class="tile">
          <div class="tile is-parent is-3">
            <div class="tile is-child card">
              <div class="card-content">
                <div class="media">
                  <div class="media-left">
                    <figure class="image is-48x48">
                      <img src="https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/bb/bbd4e5592832eedc2b041c26d91f121702dbae0f_full.jpg">
                    </figure>
                  </div>
                  <div class="media-content">
                    <p class="title is-5">Fishy</p>
                    <p class="subtitle is-6">Online</p>
                  </div>
                  <div class="media-right">
                    <b-checkbox></b-checkbox>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="tile is-parent is-3">
            <div class="tile is-child card">
              <div class="card-content">
                <div class="media">
                  <div class="media-left">
                    <figure class="image is-48x48">
                      <img src="https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/83/83ff9172657410332e62b6b3cf534e24c1085f00_full.jpg">
                    </figure>
                  </div>
                  <div class="media-content">
                    <p class="title is-5">Ron!</p>
                    <p class="subtitle is-6">Eating Corn Cookies</p>
                  </div>
                  <div class="media-right">
                    <b-checkbox></b-checkbox>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="is-divider-vertical"></div>
      <div class="tile is-parent is-4">
        <div class="tile is-child">
          <h1 class="title">Tags</h1>
          <div class="is-divider"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "Dashboard"
};
</script>

<style>
.media-content {
  overflow: hidden;
}
</style>
