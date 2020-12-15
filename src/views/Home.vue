<template>
  <div class="home">
    <Layout>
      <Header>
        <Menu
          mode="horizontal"
          theme="dark"
          active-name="1"
          style="display: flex"
        >
          <MenuItem name="1">
            <Icon type="ios-browsers-outline" />页面模板生成
          </MenuItem>
        </Menu>
      </Header>
    </Layout>
    <div class="w">
      <editor />
    </div>
  </div>
</template>

<script>
import editor from "@/components/xiumi";
export default {
  name: "Home",
  components: {
    editor,
  },
};
</script>
