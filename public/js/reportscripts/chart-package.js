! function(e) {
	"use strict";

	function t(t) {
		t ? e(".right-sidebar-mini").addClass("right-sidebar") : e(".right-sidebar-mini").removeClass("right-sidebar")
	}
	e(document).ready(function() {
		
		var a = !1;
		t(a), e(document).on("click", ".right-sidebar-toggle", function() {
			t(a = !a)
		})
		
	})

}(jQuery);
getstats(null, null)

var options = {
	chart: {
		height: 80,
		type: "area",
		sparkline: {
			enabled: !0
		},
		group: "sparklines"
	},
	dataLabels: {
		enabled: !1
	},
	stroke: {
		width: 3,
		curve: "smooth"
	},
	fill: {
		type: "gradient",
		gradient: {
			shadeIntensity: 1,
			opacityFrom: .5,
			opacityTo: 0
		}
	},
	series: [{
		name: "series1",
		data: [60, 15, 50, 30, 70]
	}],
	colors: ["var(--iq-primary)"],
	xaxis: {
		type: "datetime",
		categories: ["2018-08-19T00:00:00", "2018-09-19T01:30:00", "2018-10-19T02:30:00", "2018-11-19T01:30:00", "2018-12-19T01:30:00"]
	},
	tooltip: {
		x: {
			format: "dd/MM/yy HH:mm"
		}
	}
};

//get data
var monthlyvolumes = [10, 41, 35, 51, 49, 62, 69, 91, 148]
monthlyvolumes = []
var dailyvolumes = []
var dayvolumelabel = []
var weeklyvolumes = []
var weekvollabel = []
var yearvolumelabel = []
var yearlyvolumes = []
var monthlyprepaid = []
var monthlypayoncollect = []
async function getstats (key, value){

  
  console.log("getting info! - ", key,value)
  $.ajax({
    url: `/report/view/package/chartanalytics/${key}/${value}`,
    type: "GET", 
    async: false,
    dataType: 'json',
    success: function (response) {

		monthlyvolumes = response.monthlyvolumes
		 weeklyvolumes = response.weeklyvolumes;
		 weekvollabel = response.weekvollabel;
		 yearvolumelabel = response.yearvolumelabel;
		 yearlyvolumes = response.yearvolume;
		 dailyvolumes  = response.dailyvolumes;
		 dayvolumelabel = response.dayvolumelabel;
		 monthlyprepaid = response.monthlyprepaidvolumes;
		 monthlypayoncollect = response.monthlypayoncollectvolumes;
		 if(key && value){
			$('#appliedfilter').text(`${key}, ${value}`)
		 }
       
		if (jQuery("#chartdiv").length && jQuery(document).ready(function() {}), 
		jQuery("#package-month-chart").length) {
		options = {
			chart: {
				height: 350,
				type: "line",
				zoom: {
					enabled: !1
				}
			},
			colors: ["#1e3d73"],
			series: [{
				name: "Package Requests",
				data: monthlyvolumes
			}],
			dataLabels: {
				enabled: !1
			},
			stroke: {
				curve: "straight"
			},
			title: {
				text: "Number of packages",
				align: "left"
			},
			grid: {
				row: {
					colors: ["#f3f3f3", "transparent"],
					opacity: .5
				}
			},
			xaxis: {
				categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			}
		};
		(chart = new ApexCharts(document.querySelector("#package-month-chart"), options)).render()
		}
		if (jQuery("#package-day-chart").length) {
		options = {
			chart: {
				height: 350,
				type: "bar",
				zoom: {
					enabled: !1
				}
			},
			colors: ["#1e3d73"],
			series: [{
				name: "package Requests",
				data: dailyvolumes
			}],
			dataLabels: {
				enabled: !1
			},
			stroke: {
				curve: "straight"
			},
			title: {
				text: "Number of packages per day",
				align: "left"
			},
			grid: {
				row: {
					colors: ["#f3f3f3", "transparent"],
					opacity: .5
				}
			},
			xaxis: {
				categories: dayvolumelabel
			}
		};
		(chart = new ApexCharts(document.querySelector("#package-day-chart"), options)).render()

		}
		if (jQuery("#package-week-chart").length) {
		options = {
			chart: {
				height: 350,
				type: "line",
				zoom: {
					enabled: !1
				}
			},
			colors: ["#1e3d73"],
			series: [{
				name: "package Requests",
				data: weeklyvolumes
			}],
			dataLabels: {
				enabled: !1
			},
			stroke: {
				curve: "straight"
			},
			title: {
				text: "Number of packages per week",
				align: "left"
			},
			grid: {
				row: {
					colors: ["#f3f3f3", "transparent"],
					opacity: .5
				}
			},
			xaxis: {
				categories: weekvollabel
			}
		};
		(chart = new ApexCharts(document.querySelector("#package-week-chart"), options)).render()

		}
		if (jQuery("#package-year-chart").length) {
		options = {
			chart: {
				height: 350,
				type: "bar",
				zoom: {
					enabled: !1
				}
			},
			colors: ["#1e3d73"],
			series: [{
				name: "package Requests",
				data: yearlyvolumes
			}],
			dataLabels: {
				enabled: !1
			},
			stroke: {
				curve: "straight"
			},
			title: {
				text: "Number of packages per year",
				align: "left"
			},
			grid: {
				row: {
					colors: ["#f3f3f3", "transparent"],
					opacity: .5
				}
			},
			xaxis: {
				categories: yearvolumelabel
			}
		};
		(chart = new ApexCharts(document.querySelector("#package-year-chart"), options)).render()

		}

		if (jQuery("#prepaidpostpaid-column").length) {
		options = {
			chart: {
				height: 350,
				type: "bar"
			},
			plotOptions: {
				bar: {
					horizontal: !1,
					columnWidth: "55%",
					endingShape: "rounded"
				}
			},
			dataLabels: {
				enabled: !1
			},
			stroke: {
				show: !0,
				width: 2,
				colors: ["transparent"]
			},
			colors: ["#1e3d73", "#99f6ca", "#fe517e"],
			series: [{
				name: "Pre-paid",
				data: monthlyprepaid
			}, {
				name: "Pay on Collect",
				data: monthlypayoncollect
			}],
			xaxis: {
				categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			yaxis: {
				title: {
					text: "Number of packages by method"
				}
			},
			fill: {
				opacity: 1
			},
			tooltip: {
				y: {
					formatter: function(e) {
						return  e
					}
				}
			}
		};
		(chart = new ApexCharts(document.querySelector("#prepaidpostpaid-column"), options)).render()
		}

		if(key != null) {
			setTimeout(function() {
				toastr.success("Filtered succesfully")
			  }, 1000);
			
		}
    },
    error:function(e){
        toastr.error('Unable to change. Please try again.')
        console.log(JSON.stringify(e));

    }
	
  }); 
//   if(key != null && value != null){
// 	$('#filterbranchModalLong').modal('hide');
// 	$('body').removeClass('modal-open');
//    $('.modal-backdrop').remove();
//   }


}
