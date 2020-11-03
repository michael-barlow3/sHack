<template>
  <div>
    <transition :name="slideSide">
      <component :is="tag" :class="className" v-if="isThere" :style="sideNavStyle">
        <mdb-scrollbar>
          <ul class="custom-scrollbar list-unstyled">
            <li v-if="logo" :class="logoLi">
              <div :class="logoWrapperClasses">
                <img :src="logo" :class="logoClasses" :alt="logoAlt" />
                <span v-if="!collapsed && slim && name">{{name}}</span>
              </div>
            </li>
            <slot></slot>
          </ul>
        </mdb-scrollbar>
        <div v-if="mask" :class="maskClasses" />
      </component>
    </transition>
    <div v-if="!isThere && OpenedFromOutside" id="sidenav-overlay"></div>
  </div>
</template>

<script>
import { mdbScrollbar, waves } from 'mdbvue'
import classNames from 'classnames'

const SideNav = {
  props: {
    PatientLookupResults: '',

    logoAlt: {
      type: String,
      default: ""
    },

    tag: {
      type: String,
      default: "div"
    },
    fixed: {
      type: Boolean,
      default: false
    },
    right: {
      type: Boolean,
      default: false
    },
    hidden: {
      type: Boolean
    },
    logo: {
      type: String
    },
    logoClass: {
      type: String
    },
    href: {
      type: String,
      default: '#'
    },
    to: {
      type: String
    },
    breakWidth: {
      type: Number,
      default: 1440
    },
    OpenedFromOutside: {
      type: Boolean,
      default: false
    },
    color: {
      type: String
    },
    sideNavClass: {
      type: String
    },
    mask: {
      type: String
    },
    logoSn: {
      type: Boolean,
      default: false
    },
    logoRound: {
      type: Boolean,
      default: false
    },
    sideNavStyle: {
      type: [Object, String]
    },
    slim: {
      type: Boolean,
      default: false
    },
    isCollapsed: {
      type: Boolean,
      default: false
    },
    name: String
  },
  data() {
    return {
      isThere: false
    };
  },
  computed: {
    collapsed(){
      return this.isCollapsed;
    },
    slideSide() {
      if (this.right) {
        return "slideRight";
      }
      return "slideLeft";
    },
    className() {
      return classNames(
        'side-nav',
        'wide',
        this.collapsed && 'slim',
        this.fixed && 'fixed',
        this.color,
        this.sideNavClass,
        this.right ? 'right-aligned ' : ''
      );
    },
    logoClasses() {
      return classNames(
        this.logoSn ? '' : 'img-fluid',
        this.logoClass,
        this.logoRound ? 'rounded-circle' : ''
      );
    },
    logoLi() {
      return classNames(
        this.logoSn && 'logo-sn',
        'ripple-parent'
      );
    },
    logoWrapperClasses() {
      return classNames(
        this.logoSn ? '' : 'logo-wrapper',
        this.slim ? 'sn-ad-avatar-wrapper' : '',
        this.name ? '' : 'text-center'
      );
    },
    maskClasses() {
      return classNames(
        'sidenav-bg',
        'mask-' + this.mask
      );
    }
  },
  methods: {
    updatePredicate() {
      if (!this.hidden) {
        this.isThere = window.innerWidth > this.breakWidth;
      }
    },
    handleOverlayClick() {
      console.log("SideNav.vue - update:OpenedFromOutside")
      this.$emit("update:OpenedFromOutside", !this.OpenedFromOutside);
    }
  },
  mounted() {
    this.updatePredicate();
    window.addEventListener("resize", this.updatePredicate);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.updatePredicate);
  },
  components: {
    mdbScrollbar,
  },
  mixins: [waves]
};

export default SideNav;
export { SideNav as mdbSideNav };
</script>

<style scoped>
.side-nav {
  transform: translate(0);
  right: 0;
  transition-property: all;
}
.slideLeft-enter, .slideLeft-leave-to {
  transform: translate(-100%);
  opacity: 0;
}
.slideLeft-enter-to, .slideLeft-leave {
  opacity: 1;
}
.slideLeft-leave-active, .slideLeft-enter-active {
  transition: 300ms;
}

.slideRight-enter, .slideRight-leave-to {
  transform: translate(100%);
  opacity: 0;
}
.slideRight-enter-to, .slideRight-leave {
  opacity: 1;
}
.slideRight-leave-active, .slideRight-enter-active {
  transition: 300ms;
}

.ps {
  height: 100%;
}
</style>
