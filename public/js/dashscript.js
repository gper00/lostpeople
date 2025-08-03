// inline editor
try {
  tinymce.init({
      selector: 'textarea#post-body',
      height: 500,
      plugins:
          'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
      toolbar:
          'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat'
  })

  const postBody = document.querySelector('textarea#post-body')
  const postForm = document.querySelector('form#post-form')
  postForm.onsubmit = function (e) {
      e.preventDefault()

      if (!postBody.value.length) {
          console.log('Post body is required')
      } else {
          postForm.submit()
      }
  }
} catch (error) {
  console.log(error)
}

// image preview
try {
  document.querySelector('#image').onchange = function () {
      let file = this.files[0]
      if (file) {
          let reader = new FileReader()
          reader.onload = function (event) {
              document
                  .querySelector('#imgPreview')
                  .setAttribute('src', event.target.result)
              document
                  .querySelector('.imgPreviewContainer')
                  .classList.remove('d-none')
          }
          reader.readAsDataURL(file)
      }
  }
} catch (error) {
  console.log(error)
}

// cancel button
try {
  document.getElementById('cancel-button').onclick = () => {
      const isConfirmed = confirm('Are you sure ?')

      if (isConfirmed) {
          return history.go(-1)
      }
  }
} catch (error) {
  console.log(error)
}
