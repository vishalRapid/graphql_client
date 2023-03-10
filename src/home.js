import { useQuery, gql, useSubscription } from "@apollo/client";
import { useEffect, useState } from "react";

const GET_BLOGS = gql`
  query GetAllBlogs {
    getBlogs {
      id
      content
      author
    }
  }
`;

const UPDATE_BLOGS_SUBSCRIPTION = gql`
  subscription BlogStream {
    newBlog {
      content
      id
      author
    }
  }
`;

// function to get latest blogs from subscription
// function LatestBlogs({ chatroom }) {
//   const { data, loading } = useSubscription(UPDATE_BLOGS_SUBSCRIPTION, {
//     variables: { chatroom },
//   });

//   console.log(data, loading);
//   return <h4>New comment:</h4>;
// }

const Home = function () {
  const [blogs, setBlogs] = useState([]);
  const { loading, error, data } = useQuery(GET_BLOGS);

  // setting subscription
  const { loading_ws, error_ws, data_ws } = useSubscription(
    UPDATE_BLOGS_SUBSCRIPTION,
    {
      onSubscriptionData: (data) => {
        if (data?.subscriptionData?.data?.newBlog?.author) {
          setBlogs([...blogs, data?.subscriptionData?.data?.newBlog]);
        }
      },
    }
  );

  // setting up trigger for data change
  useEffect(() => {
    console.log({ data });
    if (data?.getBlogs?.length > 0) {
      setBlogs(data.getBlogs);
    }
  }, [data]);

  // this.LatestBlogs({ chatroom: "newBlog" });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return blogs.map(({ id, content, sender }) => (
    <div key={id} style={{ border: "1px solid black" }}>
      <h3>{content}</h3>
      <br />
      <b>Blog Writer:</b>
      <p>{sender}</p>
      <br />
    </div>
  ));
};

export default Home;
