import axios from 'axios';

export interface AniItem {
    date: string
    platform: string
    images: {
        small: string
        grid: string
        large: string
        medium: string
        common: string
    }
    summary: string
    name: string
    name_cn: string
    tags: {
        name: string
        count: number
        total_cont: number
    }[]
    infobox: {
        key: string
        value: any
    }[]
    rating: {
        rank: number
        total: number
        count: {
            "1": number
            "2": number
            "3": number
            "4": number
            "5": number
            "6": number
            "7": number
            "8": number
            "9": number
            "10": number
        },
        score: number
    }
    total_episodes: number
    collection: {
        "on_hold": number
        "dropped": number
        "wish": number
        "collect": number
        "doing": number
    }
    id: number
    eps: number
    meta_tags: string[]
    volumes: number
    series: boolean
    locked: boolean
    nsfw: boolean
    type: number
}

export interface AniSubjects {
    data: AniItem[]
    total: number
    limit: number
    offset: number
}

export interface UserCollection {
    updated_at: string
    comment: string
    tags: string[]
    subject: {
        date: string
        images: {
            small: string
            grid: string
            large: string
            medium: string
            common: string
        }
        name: string
        name_cn: string
        short_summary: string
        tags: {
            name: string
            count: number
            total_cont: number
        }[]

        score: number
        type: number
        id: number
        eps: number
        volumes: number
        collection_total: number
        rank: number
    }
    subject_id: number
    vol_status: number
    ep_status: number
    subject_type: number
    type: number
    rate: number
    private: boolean
}

export namespace bgmapi {
    export async function search_subjects(year: number, limit: number = 20) {
        try {
            const res = await axios.get<AniSubjects>(`https://api.bgm.tv/v0/subjects?type=2&sort=rank&year=${year}&limit=${limit}&offset=0`);
            return res.data;
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    export async function search_user_collection(uid: string, subject_id: number) {
        try {
            const res = await axios.get<UserCollection>(`https://api.bgm.tv/v0/users/${uid}/collections/${subject_id}`);
            return res.data;
        } catch (err) {
            console.error(err);
            return null;
        }
    }
}