import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "../../ui/dialog"
import { Label } from '../../ui/label'
import { Input } from '../../ui/input'
import { Textarea } from '../../ui/textarea'
import { Button } from '../../ui/button'


const EditPostModel = ({ isEditModalOpen, setIsEditModalOpen, handleEditPost, editingPost, handleInputChange, editPostLoading }) => {
  return (
    <>
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
            <DialogDescription>
              Make changes to your post here.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditPost}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-title" className="text-right">
                  Title
                </Label>
                <Input
                  id="edit-title"
                  name="title"
                  value={editingPost?.title || ''}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-content" className="text-right">
                  Content
                </Label>
                <Textarea
                  id="edit-content"
                  name="content"
                  value={editingPost?.content || ''}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-tags" className="text-right">
                  Tags
                </Label>
                <Input
                  id="edit-tags"
                  name="tags"
                  value={editingPost?.tags || ''}
                  onChange={handleInputChange}
                  placeholder="Separate tags with commas"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={editPostLoading}>
                {editPostLoading ? 'Updating...' : 'Update'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default EditPostModel
