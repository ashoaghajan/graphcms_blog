import React from 'react';
import { PostDetail, Author, Comments, CommentsForm, PostWidget, Categories } from '../../components';
import { getPostDetails } from '../../services';
import { getPosts } from '../../services/index';
import { useRouter } from 'next/router';
import Loader from '../../components/Loader';


const PostDetails = ({ post }) => {

    const categories = post?.categories.map(category => category.slug);
    const router = useRouter();

    if(router.isFallback){
        return <Loader />
    }

    return (
        <div className='container mx-auto ox-10 mb-8'>
            <div className='grid grid-cols-1 lg:grid-cols-12 gap-12'>
                <div className='col-span-1 lg:col-span-8'>
                    <PostDetail post={post}/>
                    <Author author={post.author}/>
                    <CommentsForm slug={post?.slug}/>
                    <Comments slug={post?.slug}/>
                </div>
                <div className='col-span-1 lg:col-span-4'>
                    <div className="relative lg:sticky top-8">
                        <PostWidget slug={post?.slug} categories={categories}/>
                        <Categories />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostDetails;

export async function getStaticProps({ params }){
    const data = await getPostDetails(params.slug);
  
    return {
      props: { post: data }
    }
}

export async function getStaticPaths(){
    const posts = await getPosts();
  
    return {
      paths: posts.map(({ slug }) => ({ params: { slug } })),
      fallback: true
    }
}
