import fs from 'node:fs';
import { getUid } from '../utils/uid.js';

/**
 * @description 获取mock数据
 * @returns 
 */
export function svr_getWorkDetailMock(){
    return {
        user_id: 0,
        work_id: 0,
        work_name: 'work_name_test',
        work_description: 'work_description_test',
        work_image: 'work_image_test',
        work_prompt_cn: "work_prompt_cn_test",
        work_prompt_en: "work_prompt_en_test",
        work_outer_link_list: [
            {
                name: 'work_outer_link_list_name_test',
                url: 'work_outer_link_list_url_test'
            }
        ],
    }
}

const WORKS_FILE_PATH = '__tmp__works.json';


/**
 * @description 根据workId获取作品详情
 * @param {number} workId 
 * @returns 
 */
export function svr_getWorkDetailById(workId){
    let work_list = read_file_as_array(WORKS_FILE_PATH, []);
    let work = work_list.find(work=>work.work_id === workId);
    return work;
}

/**
 * @description 更新作品详情
 * @param {number} workId 
 * @param {object} work 
 * @returns 
 */
export function svr_updateWorkDetail(workId, work){
    let work_list = read_file_as_array(WORKS_FILE_PATH, [svr_getWorkDetailMock()]);
    let work_index = work_list.findIndex(work=>work.work_id === workId);
    if(work_index !== -1){
        work_list[work_index] = work;
    }
    write_file_as_array(WORKS_FILE_PATH, work_list);
    return work_list;
}

/**
 * @description 创建作品详情
 * @param {object} work 
 * @returns 
 */
export function svr_createWorkDetail(work){
    let work_list = read_file_as_array(WORKS_FILE_PATH, [svr_getWorkDetailMock()]);
    work.work_id = getUid();
    work_list.push(work);
    write_file_as_array(WORKS_FILE_PATH, work_list);
    return work_list;
}



function read_file_as_array(file_path, default_value = []){
    if(!fs.existsSync(file_path)){
        return default_value;
    }
    let file_content = fs.readFileSync(file_path, 'utf-8');
    let value = JSON.parse(file_content);
    if(value instanceof Array){
        return value;
    }else{
        return default_value
    }
}

function write_file_as_array(file_path, array, default_value = []){
    if(!fs.existsSync(file_path)){
        fs.writeFileSync(file_path, JSON.stringify(default_value, null, 2));
    }
    if(array instanceof Array){
        fs.writeFileSync(file_path, JSON.stringify(array, null, 2));
    }else{
        fs.writeFileSync(file_path, JSON.stringify(default_value, null, 2));
    }
}