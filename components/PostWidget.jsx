import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Link from 'next/link';
import { getRecentPosts } from '../services';
import { getSimilarPosts } from '../services/index';

const PostWidget = ({ categories, slug }) => {
    const [relatedPosts, setRelatedPosts] = useState([]);

    useEffect(() => {
        if(slug){
            getSimilarPosts(slug, categories).then(data => {
                setRelatedPosts(data);
            });
        }
        else{
            getRecentPosts().then(data => {
                setRelatedPosts(data);
            });
        }
    },[slug]);


    return (
        <div className='bg-white shadow-lg rounded-lg p-8 mb-8'>
            <h3 className='text-xl mb-8 font-semibold border-b pb-4'>
                {slug ? 'Related Posts' : "Recent Posts"}
            </h3>
            {relatedPosts.map(post => (
                <div className='flex items-center w-full mb-4' key={post.id}>
                    <div className="w-16 flex-none">
                        <img src={post.featuredImage.url} alt={post.title} height={50} width={50} 
                            className='align-middle rounded-full'
                        />
                    </div>
                    <div className="flex-grow ml-4">
                        <p className='text-gray-500 fint-xs'>
                            {moment(post.createdAt).format('MMM DD YYYY')}
                        </p>
                        <Link href={`/post/${post.slug}`} className='text-md'>
                            {post.title}
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default PostWidget
