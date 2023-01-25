import Swal from "sweetalert2";

export const AlertSuccess = (Title = 'Success', message = 'Successfully completed transaction') => Swal.fire(
    Title,
    message,
    'success'
  )

export const AlertFail = (Title = 'Oopss..', message = 'Error during transaction') => Swal.fire(
    Title,
    message,
    'error'
  )

export const AlertWarning = (Title = 'Atenção', message = '') => Swal.fire(
    'Good job!',
    'You clicked the button!',
    'warning'
  )

export const AlertInfo = (Title = 'Aviso', message = '') => Swal.fire(
    Title,
    message,
    'info'
)

export const AlertLoading = (Title = 'Loading, please wait...') => Swal.fire({
    title: Title,
    didOpen: () => Swal.showLoading(),
  })

export const AlertQuestion = (Title = 'Are you sure?', text = "You won't be able to revert this!") => Swal.fire({
    title: Title,
    text: text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes'
  }).then((result) => {
    if (result.isConfirmed) {
      return true
    }
  })