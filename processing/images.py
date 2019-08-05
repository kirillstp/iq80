import os, warnings
import shutil
from collections import OrderedDict

class _Image:
    def __init__(self, path, name):
        if os.getcwd() in path:
            self._path = path
        else:
            self._path = os.path.join(os.getcwd(), path)
        self._path = os.path.join(self._path, name)
        self._name = name
    
    def __call__(self):
        return self.path

    def exists(self):
        return os.path.isfile(self._path)
    
    @property
    def path(self):
        return self._path

    @property
    def name(self):
        return self._name

    def remove(self):
        if self.exists():
            return os.remove(self.path)
        else:
            # print("Trying to delete nonexistent file {}".format(self.path))
            return 

class ImageCollection:
    '''
    Data structure for the storing image objects. Creates ordered dictionary to store the name and the path of the images.
    
    Args:
        name (str): string describing collection
        directory (str): directory location to store images
        limit (int): maximum images stored in the collection. If collection exceeds limit, images will be deleted from file system based on the mode.
        mode (str): strategy for deleting images exceeding limit. FIFO - first in first out or LIFO - last in first out.
    '''
    def __init__(self, name, directory, limit = 0, mode='FIFO'):
        self._name = name
        if os.getcwd() in directory:
            self._path = directory
        else:
            self._path = os.path.join(os.getcwd(), directory)
        print("New path for image collection {}: {}".format(name,self._path))
        self.limit = limit
        if mode in ['FIFO', 'LIFO']:
            self.mode = mode
        else:
            warnings.warn("Invalid mode. Defaulting to 'FIFO'. Other option: 'LIFO'", UserWarning)
            self.mode = 'FIFO'
        self._collection = OrderedDict({})

        if not os.path.isdir(self._path):
            os.mkdir(self._path)
        else:
            files = os.listdir(self._path)
            files.sort()
            for f in files:
                self.add(f)

    def __getitem__(self, index):
        return self._collection[list(self._collection.keys())[index]]()

    @property
    def path(self):
        return self._path

    @property
    def name(self):
        return self._name
    
    @property
    def collection(self):
        return self._collection

    def add(self, name):
        # print("Adding new image called {} to {}".format(name, self._path))       
        self._collection[name] = _Image(self._path, name)
        if self.limit:
            while len(self._collection) > self.limit:
                # print("Number of files in directory: {}".format(len(os.listdir(self.path))))
                self._collection.popitem(self.mode == 'LIFO')[-1].remove()
        # print("Returning path {}".format(self._collection[name].path)) 
        return self._collection[name].path

    def remove(self, name):
        if name in self._collection.keys():
            self._collection[name].remove()
            del self._collection[name]
    
    @property
    def count(self):
        return len(self._collection)
    
    @property
    def full(self):
        # print("Collection count {} - Collection limit {}".format(self.count, self.limit))
        return self.count == self.limit

    @property
    def imlist(self):
        return list(self._collection.keys())

    def archive(self):
        zipfile_path = self.path
        if os.path.isfile(zipfile_path):
            os.remove(zipfile_path)
        shutil.make_archive(zipfile_path,
                            'zip',
                            os.path.abspath(os.path.join(zipfile_path,os.pardir)),
                            zipfile_path.split('/')[-1])
        return zipfile_path.split('/')[-1]+'.zip'

if __name__ == "__main__":
    newCollection = ImageCollection("MyCollection", "/test_images", limit = 10)
    
    for i in range(0,10):
        newCollection.add(name = "image{}".format(i))
    import pdb; pdb.set_trace()
    assert len(newCollection.collection) == 10

    newCollection.add("image10")

    assert len(newCollection.collection) == 10

    assert newCollection[0].name == 'image1'

    assert newCollection[-1].name == 'image10'

    newCollection.remove('image10')

    assert newCollection[-1].name == 'image9'

    assert len(newCollection.collection) == 9




