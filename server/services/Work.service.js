import Work from '../models/Work.model.js';

export function svr_getWorkDetailMock() {
    return { work_name: 'test' };
}

export async function svr_getWorkDetailById(workId) {
    try {
        const work = await Work.findByPk(workId);
        return work;
    } catch (error) {
        console.error('根据ID获取作品失败:', error);
        throw error;
    }
}

export async function svr_createWorkDetail(workData) {
    try {
        const newWork = await Work.create(workData);
        return newWork;
    } catch (error) {
        console.error('创建作品失败:', error);
        throw error;
    }
}

export async function svr_updateWorkDetail(workId, workData) {
    const work = await Work.findByPk(workId);
    if (!work) {
        throw new Error('作品不存在');
    }
    await work.update(workData);
    return work;
}

export async function svr_getWorkList(options) {
    const { user_id, work_name, work_status, page = 1, pageSize = 10 } = options;
    const whereClause = {};
    // if (user_id) whereClause.user_id = user_id;
    if (work_name) whereClause.work_name = { [Work.sequelize.Op.like]: `%${work_name}%` };
    if (work_status) whereClause.work_status = work_status;

    let find_query = {
        where: whereClause,
        limit: parseInt(pageSize),
        offset: (parseInt(page) - 1) * parseInt(pageSize),
        order: [['work_created_at', 'DESC']]
    };
    // console.log('[jser svr_getWorkList] find_query', find_query)
    let find_res = await Work.findAndCountAll(find_query);
    const { count, rows } = find_res;
    // console.log('[jser svr_getWorkList] find_res', find_res)
    // return { list: rows.map(row => row.dataValues), total: count, page: parseInt(page), pageSize: parseInt(pageSize) };
    let list = rows.map(row => row.dataValues);
    // console.log('[jser svr_getWorkList] list', list)
    return list;
}

export async function svr_deleteWork(workId) {
    try {
        const work = await Work.findByPk(workId);
        if (!work) {
            throw new Error('作品不存在');
        }
        await work.destroy();
        return true;
    } catch (error) {
        console.error('删除作品失败:', error);
        throw error;
    }
}
