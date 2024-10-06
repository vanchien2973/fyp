import { Filter, HeartIcon, MessageCircleIcon, MoveHorizontalIcon, Plus, SearchIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { UserAvatar } from '../../ui/avatar'
import { Card, CardContent, CardFooter, CardHeader } from '../../ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../ui/dropdown-menu'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { useCreatePostMutation, useDeletePostMutation, useEditPostMutation, useGetAllPostsQuery } from '@/app/redux/features/forum/forumApi'
import Loader from '../../Loader/Loader'
import { format } from 'timeago.js'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../ui/pagination"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog"
import { Label } from "../../ui/label"
import { Textarea } from "../../ui/textarea"
import toast from 'react-hot-toast'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../ui/alert-dialog'
import CommentSection from './CommentSection'
import EditPostModel from './EditPostModel'
import socketIO from 'socket.io-client';
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || '';
const socketId = socketIO(ENDPOINT, { transports: ['websocket'] });


const Forum = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0)
  const { data, isLoading, refetch } = useGetAllPostsQuery({ page: currentPage }, {
    refetchOnMountOrArgChange: true
  });
  const [createPost, { isLoading: createPostLoading, isSuccess, error }] = useCreatePostMutation();
  const [editPost, { isLoading: editPostLoading, isSuccess: editPostSuccess, editPostError }] = useEditPostMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', tags: '' });
  const [editingPost, setEditingPost] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletePost, { isLoading: deletePostLoading, error: deletePostError, isSuccess: deletePostSuccess }] = useDeletePostMutation({});
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [totalLikes, setTotalLikes] = useState(0)
  const [totalComments, setTotalComments] = useState(0)


  useEffect(() => {
    if (deletePostSuccess) {
      setIsDeleteDialogOpen(false);
      setPostToDelete(null);
      refetch();
      toast.success('Your post has been successfully deleted.');
    }
    if (deletePostError) {
      if ("data" in deletePostError) {
        const errMessage = editPostError;
        toast.error(errMessage?.data.message);
      }
    }
  }, [deletePostLoading, deletePostError, deletePostSuccess]);

  useEffect(() => {
    if (data) {
      setPosts(data.posts);
      setFilteredPosts(data.posts);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setTotalPosts(data.totalPosts);
      // Calculate total likes and comments
      let likes = 0;
      let comments = 0;
      data.posts.forEach(post => {
        likes += post.likes.length;
        comments += post.comments.length;
      });
      setTotalLikes(likes);
      setTotalComments(comments);
    }
  }, [data]);

  useEffect(() => {
    filterAndSortPosts();
  }, [posts, searchTerm, sortBy]);

  const filterAndSortPosts = () => {
    let filtered = posts.filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    switch (sortBy) {
      case 'likes':
        filtered.sort((a, b) => b.likes.length - a.likes.length);
        break;
      case 'comments':
        filtered.sort((a, b) => b.comments.length - a.comments.length);
        break;
      case 'date':
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    setFilteredPosts(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      refetch();
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setIsModalOpen(false);
      setNewPost({ title: '', content: '', tags: '' });
      refetch();
      socketId.emit('notification', {
        title: 'New Forum Post',
        message: `${user.name} has created a new forum post: ${newPost.title}`,
        type: 'system'
      });
      toast.success("Your post has been successfully created.");
    }
    if (error) {
      if ("data" in error) {
        const errMessage = error;
        toast.error(errMessage?.data.message);
      }
    }
  }, [createPostLoading, isSuccess, error]);

  useEffect(() => {
    if (editPostSuccess) {
      setIsEditModalOpen(false);
      setEditingPost(null);
      refetch();
      toast.success("Your post has been successfully updated.");
    }
    if (editPostError) {
      if ("data" in editPostError) {
        const errMessage = editPostError;
        toast.error(errMessage?.data.message);
      }
    }
  }, [editPostLoading, editPostSuccess, editPostError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (isEditModalOpen) {
      setEditingPost(prev => ({ ...prev, [name]: value }));
    } else {
      setNewPost(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    if (!createPostLoading) {
      await createPost({
        title: newPost.title,
        content: newPost.content,
        tags: newPost.tags.split(',').map(tag => tag.trim())
      }).unwrap();
    }
  };

  const handleEditPost = async (e) => {
    e.preventDefault();
    if (!editPostLoading) {
      await editPost({
        postId: editingPost._id,
        title: editingPost.title,
        content: editingPost.content,
        tags: editingPost.tags.split(',').map(tag => tag.trim())
      }).unwrap();
    }
  };

  const handleDeletePost = async () => {
    if (postToDelete && !deletePostLoading) {
      await deletePost(postToDelete._id).unwrap();
    }
  };

  const openDeleteDialog = (post) => {
    setPostToDelete(post);
    setIsDeleteDialogOpen(true);
  };

  const openEditModal = (post) => {
    setEditingPost({
      ...post,
      tags: post.tags.join(', ')
    });
    setIsEditModalOpen(true);
  };

  return (
    <>
      {
        isLoading ? (
          <Loader />
        ) : (
          <>
            <div className='flex flex-col min-h-screen font-sans mb-8'>
              <div className="container mx-auto px-4 md:px-6 py-8">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold mb-4 sm:mb-0">Forum</h1>
                  <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <div className="relative w-full sm:w-auto">
                      <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search by title or tags..."
                        className="w-full sm:w-[200px] lg:w-[300px] pl-8 pr-4 py-2 rounded-lg bg-background"
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline"><Filter className='h-4 w-4 mr-2'/>Filter</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleSortChange('date')}>Date</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSortChange('likes')}>Likes</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSortChange('comments')}>Comments</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className='h-4 w-4 mr-2' />New Post
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Create New Post</DialogTitle>
                          <DialogDescription>
                            Create a new post to share with the community.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmitPost}>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="title" className="text-right">
                                Title
                              </Label>
                              <Input
                                id="title"
                                name="title"
                                value={newPost.title}
                                onChange={handleInputChange}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="content" className="text-right">
                                Content
                              </Label>
                              <Textarea
                                id="content"
                                name="content"
                                value={newPost.content}
                                onChange={handleInputChange}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="tags" className="text-right">
                                Tags
                              </Label>
                              <Input
                                id="tags"
                                name="tags"
                                value={newPost.tags}
                                onChange={handleInputChange}
                                placeholder="Separate tags with commas"
                                className="col-span-3"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit" disabled={createPostLoading}>
                              {createPostLoading ? 'Creating...' : 'Create'}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
              <main className="flex-1 dark:text-white">
                <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-8">
                  <div className="flex-1">
                    <div className="grid gap-4">
                      {
                        filteredPosts.map((post) => (
                          <Card key={post._id} className='bg-white rounded-lg shadow-sm p-6 dark:bg-black dark:shadow-none'>
                            <CardHeader className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <UserAvatar user={post?.user} />
                                <div>
                                  <div className="font-medium">{post.user.name}</div>
                                  <div className="text-xs text-muted-foreground">{format(post.createdAt)}</div>
                                </div>
                              </div>
                              {(post.user._id === user._id || user.role === 'admin') && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full">
                                      <MoveHorizontalIcon className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    {post.user._id === user._id && (
                                      <DropdownMenuItem onClick={() => openEditModal(post)}>Edit</DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem onClick={() => openDeleteDialog(post)}>Delete</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}

                            </CardHeader>
                            <CardContent>
                              <h3 className="text-lg font-semibold">{post.title}</h3>
                              <p className="mt-2 text-muted-foreground">{post.content}</p>
                            </CardContent>
                            <CommentSection
                              postTitle={post.title}
                              postId={post._id}
                              likes={post.likes}
                              comments={post.comments}
                              currentUser={user}
                              refetch={refetch}
                            />
                          </Card>
                        ))}
                    </div>
                    <Pagination className="mt-6">
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                          />
                        </PaginationItem>
                        {[...Array(totalPages)].map((_, index) => (
                          <PaginationItem key={index}>
                            <PaginationLink
                              onClick={() => handlePageChange(index + 1)}
                              isActive={currentPage === index + 1}
                            >
                              {index + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                  <Card className="bg-white rounded-lg shadow-sm p-6 dark:bg-black dark:shadow-none">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 dark:text-white">Forum Information</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-gray-600 font-medium dark:text-gray-400">Total Topics</h4>
                        <p className="text-gray-900 font-bold dark:text-white">{totalPosts}</p>
                      </div>
                      <div>
                        <h4 className="text-gray-600 font-medium dark:text-gray-400">Total Likes</h4>
                        <p className="text-gray-900 font-bold dark:text-white">{totalLikes}</p>
                      </div>
                      <div>
                        <h4 className="text-gray-600 font-medium dark:text-gray-400">Total Comments</h4>
                        <p className="text-gray-900 font-bold dark:text-white">{totalComments}</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </main>
            </div>
          </>
        )
      }
      {/* Edit Post Modal */}
      <EditPostModel
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        handleEditPost={handleEditPost}
        editingPost={editingPost}
        handleInputChange={handleInputChange}
        editPostLoading={editPostLoading}
      />
      {/* Delete Post Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your post and remove the data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePost} disabled={deletePostLoading}>
              {deletePostLoading ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default Forum
