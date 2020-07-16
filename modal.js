// Modal code from W3 Schools https://www.w3schools.com/howto/howto_css_modals.asp    

function modal (jobs, propFemale, payGap, numJobs) {

    // Get the modal
    let modal = document.getElementById('myModal');

    // Get the <span> element that closes the modal
    let span = document.getElementsByClassName('close')[0];

    // change the text to reflect values of selected ellipse
    $('.jobs').text(jobs);
    $('.propFemale').text('Proportion of women: ' + propFemale);
    $('.payGap').text('Pay gap: ' + payGap);
    $('.numJobs').text('Number of jobs in sector: ' + numJobs);

    // open the modal
    modal.style.display = 'block';

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
    modal.style.display = 'none';
    };

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
        }
    };

}
