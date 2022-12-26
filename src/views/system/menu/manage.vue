<script setup lang="ts">
import { reactive, ref, watch } from "vue";

const formLabelWidth = "140px";

interface Props {
  dialogFormVisible: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  dialogFormVisible: false
});

watch(
  () => props.dialogFormVisible,
  val => {
    visible.value = val;
  }
);

const visible = ref(false);

const form = reactive({
  name: "",
  region: "",
  date1: "",
  date2: "",
  delivery: false,
  type: [],
  resource: "",
  desc: ""
});
</script>

<template>
  <div>
    <el-dialog v-model="visible" title="Shipping address">
      <el-form :model="form">
        <el-form-item label="Promotion name" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Zones" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="Please select a zone">
            <el-option label="Zone No.1" value="shanghai" />
            <el-option label="Zone No.2" value="beijing" />
          </el-select>
        </el-form-item>
      </el-form>
      <!--      <template #footer>-->
      <!--        <span class="dialog-footer">-->
      <!--          <el-button @click="dialogFormVisible = false">Cancel</el-button>-->
      <!--          <el-button type="primary" @click="dialogFormVisible = false">-->
      <!--            Confirm-->
      <!--          </el-button>-->
      <!--        </span>-->
      <!--      </template>-->
    </el-dialog>
  </div>
</template>
