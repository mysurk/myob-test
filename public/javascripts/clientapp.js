function init() {
  $('.progress').addClass('hide');
  $('.form-control').val('');
  $('#output-file').addClass('hide');

  $('#input-file').on('click', function () {
    this.value = null;
    $('.progress').addClass('hide');
    $('.form-control').val('');
  });

  $('#input-file').on('change', function() {
    var files = $(this).get(0).files;
    if (files.length > 0){
      var file = files[0];
      $('#payslip').data('file', file);
      $('.form-control').val(file.name);
    }
  });

  $('#payslip').on('click', function () {
    var file = $(this).data('file');
    if(file == null) {
      alert('Select a file to process');
      return false
    }
    $('.progress').removeClass('hide');
    var formData = new FormData();
    formData.append('uploads[]', file, file.name);
    $.ajax({
      url: '/generatepayslip',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(data, status, xhr){
        if(data.error) {
          alert(data.error);
          return;
        }
        console.log('success');
        $('#output-file').attr({
                    'download': data.output,
                    'href': data.output,
                    'target': '_blank'
                    });
        $('#output-file')[0].click();
      },
      xhr: function() {
        var xhr = new XMLHttpRequest();
        xhr.upload.addEventListener('progress', function(evt) {
          if (evt.lengthComputable) {
            var percentComplete = evt.loaded / evt.total;
            percentComplete = parseInt(percentComplete * 100);

            $('.progress-bar').text(percentComplete + '%');
            $('.progress-bar').width(percentComplete + '%');

            if (percentComplete === 100) {
              $('.progress-bar').html('Done');
            }

          }

        }, false);

        return xhr;
      }
    });
  });
}

$(document).ready(function() {
  console.log('Client app code');
  init();
});