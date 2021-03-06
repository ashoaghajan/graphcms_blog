import { request, gql } from 'graphql-request';
import axios from 'axios';

const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT;

export const getPosts = async() => {
    const query = gql`
        query MyQuery {
            postsConnection {
                edges {
                    node {
                        author {
                            bio
                            name
                            id
                            photo {
                                url
                            }
                        }
                        createdAt
                        slug
                        title
                        excerpt
                        featuredImage {
                            url
                        }
                        categories {
                            name
                            slug
                        }
                    }
                }
            }
        }
    `;

    const result = await request(graphqlAPI, query);
    return result.postsConnection.edges.map(item => item.node);
}

export const getPostDetails = async(slug) => {
    const query = gql`
        query GetPostDetails($slug: String!) {
            post(where: { slug: $slug }){
                author {
                    bio
                    name
                    id
                    photo {
                        url
                    }
                }
                createdAt
                slug
                title
                excerpt
                featuredImage {
                    url
                }
                categories {
                    name
                    slug
                }
                content{
                    raw
                }
            }        
        }
    `;

    const result = await request(graphqlAPI, query, { slug });
    return result.post;
}

export const getRecentPosts = async() => {
    const query = gql`
        query GetPostDetails {
            posts(
                orderBy: createdAt_ASC
                last: 3
            ){
                title
                featuredImage{
                    url
                }
                createdAt
                slug
                id
            }
        }
    `;

    const result = await request(graphqlAPI, query);
    return result.posts
}

export const getSimilarPosts = async(slug, categories) => {
    const query = gql`
        query GetPostDetails($slug: String!, $categories: [String!]) {
            posts(
                where: { slug_not: $slug, AND: { categories_some: { slug_in: $categories } } },
                last: 3
            ){
                title
                featuredImage {
                    url
                }
                createdAt
                slug
                id
            }
        }
    `;

    const result = await request(graphqlAPI, query, { slug, categories });
    return result.posts;
}

export const getCategories = async() => {
    const query = gql`
        query GetCategories {
            categories {
                name
                slug
            }
        }
    `;

    const result = await request(graphqlAPI, query);
    return result.categories;
}

export const submitComment = async(commentObj) => {
    try{
        const { data } = await axios.post('/api/comments', commentObj);
        return data;
    }
    catch(err){
        console.log(err)
    }
}

export const getComments= async(slug) => {
    const query = gql`
        query GetComments($slug: String!){
            comments(where: { post: { slug: $slug } }){
                name
                createdAt
                comment
            }
        }
    `;

    const result = await request(graphqlAPI, query, { slug });
    return result.comments;
}

export const getFeaturedPosts = async () => {
    const query = gql`
      query GetFeaturedPost() {
        posts(where: {featuredPost: true}) {
          author {
            name
            photo {
              url
            }
          }
          featuredImage {
            url
          }
          title
          slug
          createdAt
        }
      }   
    `;
  const result = await request(graphqlAPI, query);

  return result.posts;
};

export const getCategoryPost = async (slug) => {
    const query = gql`
      query GetCategoryPost($slug: String!) {
        postsConnection(where: {categories_some: {slug: $slug}}) {
          edges {
            cursor
            node {
              author {
                bio
                name
                id
                photo {
                  url
                }
              }
              createdAt
              slug
              title
              excerpt
              featuredImage {
                url
              }
              categories {
                name
                slug
              }
            }
          }
        }
      }
    `;
  
    const result = await request(graphqlAPI, query, { slug });
  
    return result.postsConnection.edges;
  };