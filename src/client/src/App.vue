<template>
    <div>
        <el-button type="primary" @click="_handleAdd()">添加</el-button>
        <el-button type="primary" @click="_refresh()">刷新</el-button>
        <el-table :data="tableData" style="width: 100%" v-loading="loading">
            <el-table-column label="姓名">
                <template slot-scope="scope">
                    <span>{{ scope.row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="地址">
                <template slot-scope="scope">
                    <span>{{ scope.row.address }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" @click="_handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="_handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="会员信息"
                   :visible.sync="visiable">
            <el-form :model="form">
                <el-form-item label="姓名">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form.address" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="visiable = false">取 消</el-button>
                <el-button type="primary"
                           @click="visiable = false"
                           @click.native="_postData">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    /**
     * @file 会员列表页面
     */
    import fetch from 'util/fetch'

    export default {

        name: 'app',

        data() {
            return {
                tableData: [],

                visiable: false,

                loading: true,

                form: {
                    name: '',
                    address: ''
                }
            }
        },

        mounted() {
            this._refresh()
        },

        methods: {

            _refresh () {
                this.loading = true

                fetch.get('user').then((res) => {
                    this.loading = false
                    this.tableData = res.data
                })
            },

            _handleAdd () {
                this.form = {}
                this.visiable = true
            },

            _handleEdit(index, row) {
                this.form = row
                this.visiable = true
            },

            _handleDelete(index, row) {
                this.$confirm('此操作将永久删除该会员, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    fetch.delete('user', {_id: row._id})
                        .then((res) => {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            })
                        })
                })
            },

            _postData () {

                let reqFn = this.form._id ? 'put' : 'post',
                    tip = this.form._id ? '编辑' : '添加'

                fetch[reqFn]('user', this.form).then(res => {
                    this.$message({
                        type: 'success',
                        message: `${tip}成功!`
                    })

                    this._refresh()
                })
            }
        }
    }
</script>